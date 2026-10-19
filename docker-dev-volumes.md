# Docker Compose dev volumes (`app` service)

The `app` service in `docker-compose.dev.yaml` uses **three mounts** that stack on top of each other:

```yaml
volumes:
  - .:/app
  - app_node_modules:/app/node_modules
  - app_next:/app/.next
```

## 1. `.:/app` — bind mount (not named)

**What it is:** Your project folder on the host → `/app` in the container.

**Why you need it:** Live code. Edits to `src/app/page.tsx`, CSS, etc. show up inside the container without rebuilding the image. That is what makes dev + hot reload possible with this setup.

**Not named:** The left side is a **host path** (`.` = the directory that contains the compose file). Docker does not create a volume; it mirrors the folder.

## 2. `app_node_modules:/app/node_modules` — named volume

**What it is:** Docker-managed storage, declared at the bottom of the compose file as `app_node_modules:`.

**Why you need it:** The bind mount would also expose **Windows** `node_modules` (if any) into Linux. That breaks pnpm symlinks, native addons, and often module resolution. This mount **covers** `/app/node_modules` so only the **Linux install** from `pnpm install` in the container (see `Dockerfile.dev` startup command) is used.

**Named:** You want one persistent Linux `node_modules` per project, not a random host folder. Named volumes survive `docker compose down` (unless you pass `-v`).

## 3. `app_next:/app/.next` — named volume

**What it is:** Same idea, but for Next.js dev/build output under `.next`.

**Why you need it:** Without it, `.next` would live on the Windows bind mount → slow I/O and flaky watchers. Keeping it on a Linux volume is faster and avoids mixing host `.next` with container dev output.

**Optional but common** in Docker + Next dev on Windows/macOS.

## Why one mount is “unnamed” and two are named

| Syntax | Meaning |
|--------|---------|
| `host_path:container_path` | **Bind mount** — data lives on your machine |
| `volume_name:container_path` | **Named volume** — data lives in Docker’s volume store |

You **name** volumes when Docker should own the data (dependencies, DB, caches). You **bind** when the source of truth is your repo on disk.

## How mounts combine (order matters)

All three target paths under `/app`. More specific paths win over the general one:

1. `.:/app` → whole tree from the host  
2. `app_node_modules` → replaces only `/app/node_modules`  
3. `app_next` → replaces only `/app/.next`  

So: **source code from the host**, **dependencies + Next cache from Linux volumes**.

## How to decide what to mount where

For each path, ask:

1. **Should edits on the host appear instantly in the container?** → bind mount (e.g. `.`, or `./src:/app/src`).
2. **Must it be Linux-only or not come from the host?** → named (or anonymous) volume on that subpath (`node_modules`, `.next`, sometimes `.pnpm-store`).
3. **Should data survive container recreate?** → named volume (Postgres data, `app_node_modules` after the first install).
4. **Rebuild-only artifact?** → often no extra mount in **prod**; in **dev**, cache volumes are a performance choice.

**Rule of thumb for this project:** bind the repo root for code; volume **`node_modules`** and **`.next`** when developing on Windows with bind mounts.

## Rebuild vs new packages

Image rebuild runs `pnpm install` in the **image layers**, but at runtime **`app_node_modules` overrides** `/app/node_modules`. New packages therefore come from **`pnpm install` on container start** (see `Dockerfile.dev`), not from the bind mount alone.

- **`docker compose -f docker-compose.dev.yaml up --build`** refreshes the image.  
- **Restarting the app container** runs startup `pnpm install` and syncs the volume with `package.json` / `pnpm-lock.yaml`.

`--build` by itself does not replace an existing named volume’s contents; startup install (or removing the `app_node_modules` volume) does.
