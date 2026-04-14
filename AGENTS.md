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

# Writing Content for AI Consumption

When creating or editing content intended to be consumed by AI agents (e.g., AGENTS.md files, prompt instructions, agent configuration), follow the guidelines in [.agents/writing-for-ai.md](.agents/writing-for-ai.md).
