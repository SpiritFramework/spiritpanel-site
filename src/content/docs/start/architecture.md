---
title: Architecture
description: The panel is the control plane. FeatherWings starts each game in Docker, on this machine or on another node.
section: start
order: 2
---

Spirit Panel never runs the game itself. It stores users, nodes, and servers, then talks to FeatherWings. FeatherWings starts the container.

| Piece | Role |
| --- | --- |
| nginx | HTTPS on 443. Serves the web UI and proxies `/api` to the panel API. |
| panel-web | The React UI, served as static files. |
| panel-api | Fastify API on `127.0.0.1:3000`. Not exposed to the internet. |
| MariaDB | Panel database. |
| Redis | Queues and the schedule worker. |
| FeatherWings | Daemon that starts each game in Docker. |
| Nest | A category you name for related eggs. |
| Egg | The template FeatherWings uses to start a server. |

Bring the egg JSON you already use. A newer import refreshes the template and keeps the servers already on that egg. An egg carries `docker_images`, `startup`, `variables`, and `installation`.

## Where the daemon runs

A panel can use both of these at once.

**Same box.** FeatherWings listens on `127.0.0.1:8080`. nginx proxies the console websocket at `/wings/`.

**Remote node.** The daemon is on another machine, reached over HTTPS on that machine’s hostname. No trailing slash on the remote URL.

`API_URL` in the panel environment must match the `remote` value in the FeatherWings config exactly: HTTPS, with no trailing slash.

## On the node

FeatherWings starts the container. CPU, RAM, disk, IO, and swap use `0` for unlimited. Allocation, backup, and database limits are different: `0` means disabled, not unlimited. Reconnect needs FeatherWings 1.4.3 or newer.

## In the client area

Players get a console with tab completion, files and an editor, startup settings, power actions, backups, databases, schedules, subusers, SFTP, and tickets.
