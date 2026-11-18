---
title: After install
description: Confirm health, lock down the admin account, import eggs, and only then create a node.
section: panel
order: 4
---

The installer prints the admin credentials once. Save them before you close the session. The panel is not hosting games yet — that still needs FeatherWings. See [Connect FeatherWings](/docs/panel/connect-wings).

## Health

From the panel server, the API should answer on localhost. From anywhere else, use the public HTTPS URL. Do not open port 3000 in the firewall.

```bash
curl -s http://127.0.0.1:3000/health
curl -s https://panel.example.com/health
curl -s https://panel.example.com/health/ready
```

`/health` returns `{"status":"ok"}`. `/health/ready` should report the database and Redis as connected. Replace `panel.example.com` with the domain you installed.

If either check fails, start with [Troubleshooting](/docs/help/troubleshooting).

## First admin steps

1. Sign in at `/admin`.
2. **Admin → Settings** — turn off public registration unless you mean to leave sign-up open.
3. Keep `apps/panel-api/.env` readable only by the `spiritpanel` user: `chmod 600`.
4. Import eggs. Use **Admin → Nests & Eggs → Import Egg** with Pterodactyl `PTDL_v2` JSON, or import a directory from the checkout with `pnpm import-eggs`.
5. Add a node and its allocations, then create a server from an egg.

CPU, RAM, disk, IO, and swap use `0` for unlimited. Allocation count, backup count, and database count do not: `0` on those means disabled.

## Schedules

The schedule worker uses Redis. `/health/ready` shows whether Redis connected. If you do not want the worker running, set `DISABLE_SCHEDULE_WORKER=true` in `apps/panel-api/.env` and restart the API:

```bash
sudo systemctl restart spirit-panel-api
```

## What stays private

Ports **3000**, **3306**, and **6379** stay on the machine. The public panel ports are 22, 80, and 443. Game ports are opened on the FeatherWings host, not published as the panel API.
