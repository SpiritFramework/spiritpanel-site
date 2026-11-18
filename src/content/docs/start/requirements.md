---
title: Requirements
description: Ubuntu 22.04+ or Debian 12+, 2 GB of RAM, a domain on ports 80 and 443, and FeatherWings where the games run.
section: start
order: 3
---

Install Spirit Panel on a fresh Ubuntu or Debian server. The guided installer expects to be run as root.

## Operating system

Ubuntu 22.04 or newer, or Debian 12 or newer. Ubuntu 24.04 LTS is the recommended production host. The script checks the OS before it installs packages, and it stops if the machine is not Ubuntu or Debian.

## Hardware

| Resource | Minimum |
| --- | --- |
| CPU | 2 vCPU |
| RAM | 2 GB (4 GB recommended) |
| Disk | 40 GB SSD |

The installer warns, and can stop, when free disk is very low.

## Domain and ports

Point the panel domain at the server before you install. Certbot validates over HTTP, so the name has to resolve to this machine first.

On the panel host, the public ports are **22**, **80**, and **443**. The installer notes when 80 or 443 is already taken.

Do not publish these:

| Port | Service |
| --- | --- |
| 3000 | panel API, bound to `127.0.0.1` |
| 3306 | MariaDB |
| 6379 | Redis |

Game traffic is separate. A FeatherWings node needs its daemon port (`8080`), SFTP (`2022`), and the allocation range you assign in the panel. Those belong on the machine that hosts the games, which may be this box.

## What the installer adds

You do not install Node yourself. The script provisions Node 20, pnpm, MariaDB, Redis with a password, nginx, and a Let's Encrypt certificate. It also creates the `spiritpanel` user and checks the panel out to `/home/spiritpanel/Spirit-Panel`.

The menu covers install, update, status, backup, and uninstall.

## Game nodes

FeatherWings, with Docker, has to be on every machine that hosts games. That can be the panel host, other machines, or both.

The panel install does not replace a Wings install. Use the [FeatherWings installation guide](https://featherpanel.com/docs/wings/installation/) for the daemon.
