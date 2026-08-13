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
```

# Testing

No test framework is configured (no vitest/jest/playwright, no `test` script). Verify UI
changes by running `yarn start` and driving the page directly (e.g. with a browser
automation tool) rather than adding a test runner as a side effect of an unrelated task.

# Writing Content for AI Consumption

When creating or editing content intended to be consumed by AI agents (e.g., AGENTS.md files, prompt instructions, agent configuration), follow the guidelines in [.agents/writing-for-ai.md](.agents/writing-for-ai.md).

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
