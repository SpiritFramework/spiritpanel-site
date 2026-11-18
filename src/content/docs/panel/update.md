---
title: Update
description: Update from the copy of spirit.sh inside the install. A failed build or migration does not restart the running panel.
section: panel
order: 3
---

An installed panel updates from the script in the checkout. That is the path to use once the panel is on the server.

```bash
sudo bash /home/spiritpanel/Spirit-Panel/scripts/spirit.sh update
```

If that file is not there yet, download a fresh copy and pass `update`:

```bash
curl -fsSL https://raw.githubusercontent.com/SpiritFramework/SpiritPanel/main/scripts/spirit.sh -o /tmp/spirit.sh
sudo bash /tmp/spirit.sh update
```

Do not pipe curl into bash under sudo. See [Install](/docs/panel/install).

## What the updater does

Interactive update defaults to the channel saved in `.spirit-channel` (`release` or `dev`) and still lets you switch. It prints the current commit and the target before it continues.

On a live panel the order is:

1. Copy `.env` and `apps/panel-api/data/` (branding uploads, ticket attachments), and `mysqldump` into `/var/backups/spirit-panel/`. If the dump fails, it stops and asks before going further.
2. Check out the selected release tag, or `main`. A release checkout does not fall through to `main`.
3. `pnpm install --frozen-lockfile`, then `pnpm build`, unless that commit is already built.
4. Run database migrations.
5. Restart the API only after those steps succeed, then reload nginx and poll `/health`.

A failure in the build or the migration stops **before** the restart, so the version already running stays up. The backup path is printed either way.

`.env` and `apps/panel-api/data/` are not overwritten by the source sync.

## Status, backup, uninstall

Those actions are in the same menu. **Status** prints the installed version, channel, commit, latest release, and whether `main` is ahead of that release. **Backup** and **Uninstall** are separate menu choices. Use uninstall only when you mean to remove the panel.

Updating the panel does not update FeatherWings. Daemon updates are covered in the [FeatherWings docs](https://featherpanel.com/docs/wings/).
