# Hi, 👋!

I'm Andrew and I empower others through quality software.

I aim to make software development more accessible to a wider audience. I accomplish this primarily through mentorship, OSS, and sharing my experiences.

## Core Values

**Growth mindset**: Be willing to begin again. Empty your cup. Embrace growth opportunities.

**Cultivate community**: strive to create safe environments and empower everyone to bring their authentic self to the table.

**Honesty**: Be honest and transparent.

**Simplicity**: Favor simple solutions over easy ones.

## Topics I find Interesting

I love working on [my home ops project](https://github.com/andrew-codes/home-ops) and an open-source, self-hosted application for game management, [Playnite Web](https://github.com/andrew-codes/playnite-web). Applied design principles and patterns. Gaming; mostly PC, some PlayStation. Elixir and functional programming. Science and philosophy. Mentorship and teaching technical concepts.

## Ask Me About

Feel free to ask me about simple and easy, any of my interests, or just to talk tech. I'm always seeking individuals with a passion to learn more improve their craft.

## Goals

- Go terminal-only, with vim as my driving editor
- Explore how AI fits into my everyday developer workflows

## Connect an AI Agent

My site has a read-only [MCP](https://modelcontextprotocol.io) server at `https://andrew.codes/mcp`. There is no sign-in and nothing it can change. It answers from the same static files the site already publishes (`/agent/*.json` and the markdown copies of each post), so it only ever says what the site says. It never returns an email, phone number, or street address.

Tools:

- `get_profile`: who I am, where I am (city only), what I know, and my public links
- `search_posts`: find posts by `query`, `category`, `tag`, `company`, or `project`
- `get_post`: one post as markdown, by `slug`
- `get_resume`: my resume, or just the `experience`, `skills`, or `education` section
- `list_recommendations`: what colleagues wrote about me, optionally for one `company`
- `list_projects`: what I have built, and the technologies I use, by `company` or `topic`

The same content is also available as resources: `site://profile`, `site://resume`, `site://recommendations`, `site://projects`, `site://posts`, and `site://posts/{slug}`.

**Claude Code**

```bash
claude mcp add --transport http andrew-codes https://andrew.codes/mcp
```

**Cursor**: add this to `.cursor/mcp.json` (or `~/.cursor/mcp.json` for every project):

```json
{
  "mcpServers": {
    "andrew-codes": {
      "url": "https://andrew.codes/mcp"
    }
  }
}
```

**Claude Desktop**: add this to `claude_desktop_config.json`, which bridges to the remote server with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "andrew-codes": {
      "command": "npx",
      "args": ["mcp-remote", "https://andrew.codes/mcp"]
    }
  }
}
```

Any other MCP client that speaks streamable HTTP can use the same URL. To poke at it by hand, run `npx @modelcontextprotocol/inspector@latest` and connect to it.

Browsers that support [WebMCP](https://webmachinelearning.github.io/webmcp/) also get the same six tools while the site is open. WebMCP is an early draft, so the site registers them only when the browser offers it and does nothing otherwise.

The server lives in `worker/src/mcp.ts` and the tool logic in `app/libs/agent/agent-tools.ts`. To run it locally, build the site first (`yarn build`), then run `yarn wrangler dev` and use `http://localhost:8787/mcp`. Under Yarn PnP, wrangler also needs `X_LOCAL_EXPLORER=false` to start.

## Connect With Me

I do not favor unexpected phone calls. I prefer to chat in public forums, so information can be more easily shared. I strive to be available to answer questions, pair program, etc.

[My site](https://andrew.codes) - [Resume](https://andrew.codes/James%20Andrew%20Smith%20-%20Resume.pdf) - [LinkedIn](https://www.linkedin.com/in/jamesandrewsmith/)
