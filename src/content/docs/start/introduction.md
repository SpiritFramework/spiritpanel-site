---
title: Introduction
description: Spirit Panel is the control plane. FeatherWings, with Docker, runs each game server.
section: start
order: 1
---

Spirit Panel is a self-hosted game server control panel. The web UI, sessions, and API live on the panel. The game process does not.

Each server runs in its own Docker container on [FeatherWings](https://featherpanel.com/docs/wings/). One panel can use a daemon on the same machine and nodes on other machines at the same time.

## What you get

- Users, nodes, and servers in one web UI
- Pterodactyl eggs, grouped into nests you name
- A client area with console, files, power, backups, databases, schedules, subusers, SFTP, and tickets
- HttpOnly session cookies, optional 2FA, and scoped application API keys

Minecraft plugins from Modrinth and the FiveM marketplace ship with the panel. Other games come from the eggs you import.

## What this site documents

These pages cover the panel: what to install it on, how to run `spirit.sh`, and how the panel should point at FeatherWings.

FeatherWings installation, `config.yml`, and daemon troubleshooting stay on FeatherPanel. The Wings section in the sidebar links there.

## License

Spirit Panel is AGPL-3.0. The files on [GitHub](https://github.com/SpiritFramework/SpiritPanel) are the panel you install. If you modify Spirit Panel and run that version as a network service, you offer the corresponding source to the people using it.
