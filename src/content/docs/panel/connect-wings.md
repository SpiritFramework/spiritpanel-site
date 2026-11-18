---
title: Connect FeatherWings
description: Point the panel at a same-box daemon, a remote node, or both. API_URL must match the FeatherWings remote exactly.
section: panel
order: 2
---

Spirit Panel never runs game workloads. Each server is a Docker container managed by FeatherWings. One panel can use a same-box daemon and remote nodes together.

Install the daemon with the [FeatherWings installation guide](https://featherpanel.com/docs/wings/installation/). `config.yml` is documented in [FeatherWings configuration](https://featherpanel.com/docs/wings/configuration/).

## In the panel

**Admin → Nodes → Add Node.** Set the node FQDN, the scheme, daemon listen port `8080`, and SFTP port `2022`. Add allocations as an IP plus the port range players will use.

`API_URL` in `apps/panel-api/.env` is the public panel URL. It must match the `remote` value in the FeatherWings config exactly: HTTPS, with no trailing slash. A trailing slash, a different host, or HTTP where the daemon expects HTTPS is enough to break the match.

When the node asks for join data, paste it from **Admin → Nodes → Join-data**.

The node token is separate from `API_URL`. The token value in **Admin → Nodes → Wings Config** must match `token` in `/etc/featherpanel/config.yml`. If they drift, rotate the token in the panel, update the config, and restart FeatherWings.

## Same box

Use the daemon on the panel host.

- Address: `127.0.0.1:8080`
- nginx proxies the console websocket at `/wings/`

Browsers block `ws://` on an HTTPS panel. The `/wings/` proxy is what keeps the console on `wss://` without exposing the daemon port as the console URL.

## Remote node

Use HTTPS on that machine’s own hostname, and set the node scheme to `https`. Do not add a trailing slash to the remote URL.

Open `8080/tcp`, `2022/tcp`, and the allocation range on that machine. Do not put the Wings hostname behind Cloudflare’s proxy if clients reach it on port `8080`. Grey-cloud that name.

## Check the daemon

On the game machine:

```bash
curl -s http://127.0.0.1:8080/api/system
```

A node that stays offline, a console that never connects, or SFTP that refuses the login is covered in [Troubleshooting](/docs/help/troubleshooting). Reconnect from the panel needs FeatherWings 1.4.3 or newer.
