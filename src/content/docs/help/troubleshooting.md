---
title: Troubleshooting
description: Installer, certificate, 502, migrations, Wings auth, console, SFTP, and schedules — what to check first.
section: help
order: 1
---

Run **Status** before changing anything. It prints the installed version, channel, commit, and latest release.

```bash
sudo bash /home/spiritpanel/Spirit-Panel/scripts/spirit.sh status
```

API logs:

```bash
sudo systemctl status spirit-panel-api
journalctl -u spirit-panel-api -n 50 --no-pager
```

Health, from the panel server:

```bash
curl -s http://127.0.0.1:3000/health
curl -s http://127.0.0.1:3000/health/ready
```

`/health/ready` is the one that reports the database and Redis. Paths and the public URL checks are in [After install](/docs/panel/after-install).

| Symptom | Look here |
| --- | --- |
| `/dev/fd/63: No such file or directory` | [Installer will not start](#installer-will-not-start) |
| Certificate did not issue, or the panel is only on HTTP | [Certificate](#certificate-did-not-issue) |
| 502 on `/api` | [502](#502-on-api) |
| 500 on `/api/client/servers` or `/api/admin/servers` | [500 after an update](#500-on-server-routes) |
| Blank `/admin` | [Blank admin page](#blank-admin-page) |
| Database access denied | [Database](#database-access-denied) |
| Panel is up, games never start | [Games do not start](#games-do-not-start) |
| Wings 401 or 403 | [Node token](#wings-401-or-403) |
| Console fails, or the browser mentions mixed content | [Console](#console-websocket) |
| SFTP login fails | [SFTP](#sftp) |
| Schedules do nothing, or the worker errors | [Schedules](#schedules) |

Daemon crashes, image pulls, and Wings service logs belong in the [FeatherWings troubleshooting guide](https://featherpanel.com/docs/wings/troubleshooting/).

## Installer will not start

Save the script, then run the file. `sudo bash <(curl ...)` fails because sudo closes the `/dev/fd/…` descriptor process substitution needs. Bash then reports `/dev/fd/63: No such file or directory`.

```bash
curl -fsSL https://raw.githubusercontent.com/SpiritFramework/SpiritPanel/main/scripts/spirit.sh -o /tmp/spirit.sh
sudo bash /tmp/spirit.sh
```

If the banner still says script `2.0.x` or `1.0.0`, `/tmp/spirit.sh` is stale. Download it again.

The script only supports Ubuntu and Debian. It warns or stops when free disk is very low, and it tells you if port 80 or 443 is already in use. Those two ports have to be free for nginx and certbot. See [Requirements](/docs/start/requirements).

## Certificate did not issue

The panel domain has to resolve to this server before certbot runs. Certbot validates over HTTP.

If issuance fails, the installer leaves the panel serving plain HTTP and prints a retry command. nginx is still a valid site. Fix DNS, wait until the name resolves to this machine, then run the retry it printed — or run the installer again.

`--no-tls` is the flag when something else already terminates HTTPS. Do not use it to skip DNS you still need.

## 502 on `/api`

nginx proxies `/api` to `127.0.0.1:3000`. A 502 means that process is not answering.

```bash
sudo systemctl status spirit-panel-api
journalctl -u spirit-panel-api -n 50 --no-pager
curl -s http://127.0.0.1:3000/health
```

Check these before you change nginx:

- `HOST=127.0.0.1` in `apps/panel-api/.env`
- the `spiritpanel` user can read that file. If permissions fail verification: `sudo chown spiritpanel:spiritpanel apps/panel-api/.env && sudo chmod 600 apps/panel-api/.env`
- then `sudo systemctl restart spirit-panel-api`

Do not open port 3000 to the internet to “reach” the API. The public URL is `https://your-domain/api`.

## 500 on server routes

A 500 on `/api/client/servers` or `/api/admin/servers/*` after a deploy is usually a migration that did not apply. From the checkout, as the app user:

```bash
cd /home/spiritpanel/Spirit-Panel/apps/panel-api
pnpm exec prisma migrate deploy
pnpm exec prisma migrate status
sudo systemctl restart spirit-panel-api
```

The guided updater runs migrations itself and, if they fail, does not restart. A 500 after a hand update usually means that migrate step was skipped. See [Update](/docs/panel/update).

## Blank admin page

The UI is the static build nginx serves from `apps/panel-web/dist/`.

```bash
ls /home/spiritpanel/Spirit-Panel/apps/panel-web/dist/index.html
```

If that file is missing, the web build did not finish. From the app root, `pnpm build`, then reload nginx.

nginx’s `root` must be that `dist` directory. The site file is `/etc/nginx/sites-available/spirit-panel`. If nginx cannot traverse the home directory, `chmod o+x /home/spiritpanel`.

## Database access denied

From the checkout, as the `spiritpanel` user, not as root:

```bash
cd /home/spiritpanel/Spirit-Panel
./install --production --api-url https://panel.example.com --fix-database
```

Use the real panel URL. `./install` calls `sudo mysql` itself when it needs to. Do not run that command under sudo.

## Games do not start

The panel never runs the game. FeatherWings, with Docker, has to be installed on the machine that should host the server, and the node has to be online in **Admin → Nodes**.

Follow the [FeatherWings installation guide](https://featherpanel.com/docs/wings/installation/), then [connect the node](/docs/panel/connect-wings). On that machine:

```bash
curl -s http://127.0.0.1:8080/api/system
```

An install that sits forever is usually the daemon or the egg image, not the panel. On the node: `journalctl -u wings -f` (or the FeatherWings unit, if that host named it `featherwings`) and confirm the image can be pulled.

## Wings 401 or 403

Panel-to-daemon auth uses the node token, not the admin password.

1. Copy the token from **Admin → Nodes → Wings Config**.
2. It must match `token` in `/etc/featherpanel/config.yml`.
3. If you are not sure they match, rotate the token in the panel, put the new value in the config, and restart FeatherWings.

```bash
curl -s http://127.0.0.1:8080/api/system -H "Authorization: Bearer YOUR_TOKEN_SECRET"
```

`API_URL` is a different check. It must equal `remote` in that same config: HTTPS, no trailing slash. A 401 with a matching URL is the token. A node that never even attempts the call is usually `remote` or DNS.

## Console websocket

The panel page can load while the console stays disconnected. Browsers block `ws://` on an HTTPS panel.

**Same box.** The node address is `127.0.0.1:8080`, and nginx proxies the console at `/wings/`. Without that location, the browser is asked for plain `ws://` and refuses it.

**Remote node.** The node scheme is `https`, on that machine’s hostname, with no trailing slash. Port `8080/tcp` has to be open on the node. If you locked the firewall down to 80 and 443 only, the console, SFTP, and game ports go with it — allow `8080`, `2022`, and the allocation range again.

If the Wings hostname is proxied through Cloudflare on port 8080, grey-cloud that DNS record. Cloudflare’s HTTP proxy does not carry that daemon port.

A reconnect option in the panel needs FeatherWings 1.4.3 or newer.

## SFTP

SFTP uses port **2022** on the FeatherWings host, not port 22 on the panel. Open `2022/tcp` on the node. The username format is the one the panel shows for that server. A wrong token or a daemon that is down fails the same way as a closed port — check [Wings 401 or 403](#wings-401-or-403) if the port is open and the login is still rejected.

## Schedules

Schedules need Redis. `curl -s http://127.0.0.1:3000/health/ready` should show Redis connected. The installer starts Redis with a password; a ready check that only fails Redis means the API cannot reach it with the URL in `.env`.

To stop the worker without removing Redis, set `DISABLE_SCHEDULE_WORKER=true` and `sudo systemctl restart spirit-panel-api`.

## Behind Cloudflare

The panel can sit behind Cloudflare. A few failures show up only after that:

| What you see | What it usually is |
| --- | --- |
| `nginx -t` names `spirit_web`, `spirit_api`, or `spirit_conn` | The rate-limit zone file is missing. The updater installs `/etc/nginx/conf.d/spirit-panel-http.conf`. |
| Login CSP error, or a script chunk returns 500 | Rocket Loader, email obfuscation, or JS minify on the Cloudflare zone. Turn those off and purge the cache. |
| `Too many open files` in `/var/log/nginx/error.log` | nginx’s file limit. The updater raises it; restart nginx after an update that says it did. |
| Panel loads, games and console do not | Game ports or `:8080` were closed, or the Wings name is orange-clouded. See [Console](#console-websocket). |

## Installed app shows the old icon

The installable app bakes its icon in when you install it. Changing branding later does not update a shortcut that already exists. Confirm the panel is serving the new icon:

```bash
curl -s https://panel.example.com/api/auth/branding/manifest.webmanifest
```

If `icons` points at the new asset, uninstall the app and install it again from the browser. On Windows, delete the old desktop shortcut and pin a new one. The panel cannot refresh an icon the operating system already stored.
