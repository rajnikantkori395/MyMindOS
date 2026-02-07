# Monorepo Guide

## Overview
MyMindOS uses a pnpm-managed monorepo to keep backend, frontend, and shared libraries in sync. All commands should be run from the repository root unless otherwise noted.

## Directory Layout
`
apps/
  backend/   # NestJS API
  frontend/  # Next.js client
libs/
  shared/    # Shared TypeScript types and utilities (WIP)
infra/
  docker/    # Local infrastructure configs
`

## Core Commands
| Purpose            | Command                                  |
|--------------------|-------------------------------------------|
| Install deps       | pnpm install                            |
| Start backend      | pnpm --filter backend start:dev         |
| Start frontend     | pnpm --filter frontend dev              |
| Run backend tests  | pnpm --filter backend test              |
| Lint frontend      | pnpm --filter frontend lint             |
| Build everything   | pnpm -r build                           |

## Workspace Tips
- Use pnpm --filter <package> <command> to target a specific app or library.
- pnpm -r <command> runs the command across all workspaces respecting dependency order.
- Add a new package under pps/ or libs/, then run pnpm install to register it.
- Reference shared packages via the workspace protocol (e.g., "workspace:*").

## Adding Shared Libraries
1. Create a directory under libs/ (e.g., libs/shared).
2. Initialize with pnpm init -y and add dependencies.
3. Export TypeScript types/functions and consume them from apps using imports such as import { Example } from '@mymindos/shared';.
4. Update 	sconfig paths if necessary to map workspace aliases.

## Scripts Reference
- Root package.json exposes helpers:
  - pnpm run dev:backend
  - pnpm run dev:frontend
  - pnpm run dev (runs both via recursive parallel mode)
  - pnpm run lint, pnpm run build

## New Contributor Checklist
1. Install prerequisites (Node 18+, pnpm, Docker optional).
2. Run pnpm install.
3. Duplicate env templates in pps/backend and pps/frontend.
4. Start services with the commands above.
5. Review module docs under docs/modules to understand responsibilities.

## Troubleshooting
- If pnpm cannot find a command, ensure corepack prepare pnpm@<version> --activate has been run.
- Delete pnpm-lock.yaml and 
ode_modules only as a last resort; prefer pnpm install --force for resolving mismatched peer dependencies.
- Use pnpm list --depth 0 --filter <package> to inspect per-package dependency graphs.

## Future Enhancements
- Introduce generators (schematics) for scaffolding new modules/libraries.
- Add Nx/Turborepo pipelines if build orchestration becomes complex.
- Document GitHub Actions workflows for CI/CD once configured.
