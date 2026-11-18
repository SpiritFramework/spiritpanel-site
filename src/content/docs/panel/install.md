---
title: Install
description: Point DNS at the server, save spirit.sh, and run it as root. Do not pipe curl into bash under sudo.
section: panel
order: 1
---

On a fresh Ubuntu or Debian server, download the installer and run it as root. See [Requirements](/docs/start/requirements) before you start.

## Point DNS first

Point the panel domain at the server before you install. Certbot validates over HTTP. If issuance fails, the installer leaves the panel on plain HTTP and prints the command to retry. It does not leave nginx broken.

## Download the script, then run it

Save the installer to a file. Do not use `sudo bash <(curl ...)`. Process substitution hands bash a `/dev/fd/…` path, sudo closes that descriptor, and bash reports `/dev/fd/63: No such file or directory`.

```bash
curl -fsSL https://raw.githubusercontent.com/SpiritFramework/SpiritPanel/main/scripts/spirit.sh -o /tmp/spirit.sh
sudo bash /tmp/spirit.sh
```

The banner prints the script version. If it still says `2.0.x` or `1.0.0`, that file is an old copy. Download `/tmp/spirit.sh` again.

Choose **Install**. The menu also covers update, status, backup, and uninstall.

The script then:

- checks the OS, free disk, and whether ports 80 and 443 are free
- installs Node 20, pnpm, MariaDB, Redis, nginx, and certbot
- creates the `spiritpanel` user
- checks the panel out to `/home/spiritpanel/Spirit-Panel`
- writes `apps/panel-api/.env`, builds, installs the systemd unit and nginx site, and requests a certificate
- prints the admin credentials — save them

You do not install Node yourself.

## Release or dev

The installer asks which line to run:

1. **Latest release** — the newest GitHub release that is not a draft or prerelease. The checkout stays on that tag.
2. **Unreleased dev** — branch `main`.

The choice is saved in `/home/spiritpanel/Spirit-Panel/.spirit-channel` as `release` or `dev`. Later updates reuse it.

Unattended install tracks the latest release:

```bash
sudo bash /tmp/spirit.sh install --domain panel.example.com --admin-email you@example.com -y
```

Add `--channel dev` to track `main` instead. `--admin-password` sets the admin password (12 characters or more). If you omit it, the script generates one. `--no-tls` skips certbot when a proxy already terminates HTTPS.

## Where the files land

| What | Path |
| --- | --- |
| App | `/home/spiritpanel/Spirit-Panel/` |
| Secrets | `/home/spiritpanel/Spirit-Panel/apps/panel-api/.env` |
| Web root | `/home/spiritpanel/Spirit-Panel/apps/panel-web/dist/` |
| nginx site | `/etc/nginx/sites-available/spirit-panel` |
| systemd unit | `/etc/systemd/system/spirit-panel-api.service` |

Re-running install keeps an existing `.env`.

## After the panel is up

Confirm it answers, then add FeatherWings. The panel still does not run games.

- [After install](/docs/panel/after-install) — health checks, eggs, and the first admin steps
- [Connect FeatherWings](/docs/panel/connect-wings) — same-box daemon, remote nodes, or both
