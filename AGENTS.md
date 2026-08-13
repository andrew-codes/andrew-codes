# Overview

Personal website, portfolio, and resume for James Andrew Smith — built with react-router SSG, Vite, TypeScript, and MUI Joy.

# Writing Blog Posts

- **Location**: all blog posts are located within the `./app/posts` directory.
- **Instructions**: review the [AGENTS.md](./app/posts/AGENTS.md) file for guidance when creating or updating blog posts.


# Package Manager

Use `yarn` (not npm). The project uses Yarn 4.x with PnP-style workspaces.

# Key Commands

```bash
yarn start          # dev server (nodemon)
yarn build          # full production build (runs clean, remix, server, and post-build steps)
yarn build/client    # react-router build only
yarn build/server   # Express server build only
yarn test           # vitest (unit tests; see app/**/*.test.tsx)
```

# Rendering Model

This is a fully static-generated site: `react-router.config.ts` sets `ssr: false`
and prerenders every route (`/`, `/posts`, `/recommendations`, every post slug,
every tag) at *build time*. There is no per-request server render in production
- `yarn start` (the Vite dev server) does per-request SSR and is **not**
representative of production rendering behavior for anything time-, locale-,
or environment-sensitive. To reproduce a production-only rendering bug
locally, build (`yarn react-router build`) and serve `build/client` as static
files instead of using the dev server.

# React Router `meta` Gotcha

`<Meta />` renders only the *last matched route's* `meta` array - it does not
merge a leaf route's `meta` with its parent's (e.g. root's) `meta`. Anything
that must appear on every page (charset, etc.) belongs as a literal tag in
`root.tsx`'s `Layout`, not in a `meta` export, or it will be silently dropped
on any route that defines its own `meta`.

# Hydration Mismatch Classes to Watch For

Two more causes of React error #418 were found after the charset fix above,
both worth checking for when adding similar code:

- **Locale-naive date formatting.** `Date#toLocaleDateString()` with no
  `timeZone` option uses the *runtime's local timezone*. Since pages are
  prerendered once at build time (CI, typically UTC) and re-rendered again at
  hydration time in the visitor's browser, any visitor in a different
  timezone gets a different calendar day for a date-only string - a text
  mismatch. `tryFormatDate` (`app/libs/utils.ts`) pins `timeZone: "UTC"` for
  this reason; use it (not a raw `toLocaleDateString()` call) for any date
  shown to visitors.
- **Block content inside `<p>`.** MDX's `p`/`blockquote` component overrides
  (`app/components/Post.tsx`) must not unconditionally wrap their children in
  `Typography` (which renders a `<p>`): a markdown paragraph or blockquote
  whose sole content is an image or a list still gets compiled through the
  same override, and a `<div>`/`<ul>` is not valid inside `<p>` per the HTML5
  content model. The browser silently auto-closes the `<p>` early, so its DOM
  doesn't match what React rendered - another hydration mismatch. See
  `hasImageChild`/`renderBlockquoteChild` in that file for the pattern to
  extend if you add another MDX component override.

# Writing Content for AI Consumption

When creating or editing content intended to be consumed by AI agents (e.g., AGENTS.md files, prompt instructions, agent configuration), follow the guidelines in [.agents/writing-for-ai.md](.agents/writing-for-ai.md).

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
