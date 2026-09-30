import { type RouteConfig, route, index } from "@react-router/dev/routes"

export default [
  index("routes/_index.tsx"),
  route("posts", "routes/posts.tsx", [route(":id", "routes/posts.$id.tsx")]),
  route("recommendations", "routes/recommendations.tsx"),
  route("tags/:id", "routes/tags.$id.tsx"),
  route("connect", "routes/connect.tsx"),
  route("connect-with-me", "routes/connect-with-me.tsx"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("feed.xml", "routes/feed.xml.ts"),
  route("agent/resume.json", "routes/agent.resume-json.ts"),
  route("resume.md", "routes/resume-md.ts"),
] satisfies RouteConfig
