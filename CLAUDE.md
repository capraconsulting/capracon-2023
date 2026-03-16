# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CapraCon conference website built with Remix 1.x, React 18, TypeScript, and Tailwind CSS. Hosted on Cloudflare Pages with Workers KV for caching. Content is sourced from Notion databases via the Notion API.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start full dev environment (CSS watch + Remix watch + Wrangler) |
| `npm run build` | Production build (CSS + Remix) |
| `npm run typecheck` | TypeScript checking (`tsc -b`) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run wrangler` | Wrangler Pages dev with local KV persistence |

Local development requires a `.dev.vars` file with `NOTION_TOKEN` and `PREVIEW_SECRET`.

## Architecture

**Data flow:** Notion databases → `app/notion/` (API client) → `app/notion-conference/` (domain parsing + KV caching) → Remix loaders → React components.

### Key directories

- **`app/routes/`** — Remix file-based routes. Main pages: `/` (practical info), `/program` (schedule grid), `/speakers`, `/talk.$slug` (talk detail), `/kontakt`, `/minnebok`.
- **`app/notion-conference/`** — Core data layer. `domain.ts` defines Zod schemas for Conference, Talk, Speaker, etc. `client.ts` fetches/parses from Notion. `client-cached-and-filtered.ts` adds KV caching (5s TTL + 24hr stale-while-revalidate) and preview mode filtering.
- **`app/notion/`** — Low-level Notion API wrapper and property extractors.
- **`app/components/`** — React UI components.
- **`app/hooks/`** — `useTheme` (dark/light with Context) and `useFavorites` (localStorage bookmarks).
- **`app/utils/consts.ts`** — Track definitions, year configs, timezone constants.

### Important patterns

- **Path alias:** Imports use `~/` prefix (maps to `app/`).
- **Root loader:** `app/root.tsx` loader fetches all conference data server-side; child routes access it via `useRouteLoaderData`.
- **Zod validation:** All Notion data is parsed through Zod schemas in `domain.ts` with error fallbacks.
- **CSS Grid schedule:** The program page uses CSS Grid with dynamically generated `grid-row`/`grid-column` styles (`app/styles/program.css` + `app/notion-conference/helpers.ts`).
- **Image proxy:** Routes `api.image-optimized.ts` and `api.image-original.ts` serve Notion-hosted images with optional cropping.
- **Cloudflare bindings:** The app expects a `KV` namespace binding and environment variables via Cloudflare context.
