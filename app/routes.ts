import { type RouteConfig, route, index } from "@react-router/dev/routes"

export default [
  index("routes/_index.tsx"),
  route("posts", "routes/posts.tsx", [
    route(":id", "routes/posts.$id.tsx"),
  ]),
  route("recommendations", "routes/recommendations.tsx"),
  route("tags/:id", "routes/tags.$id.tsx"),
  route("healthcheck", "routes/healthcheck.tsx"),
] satisfies RouteConfig
