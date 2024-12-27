import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar.tsx", [
    index("routes/home.tsx"),
    route("tasks/:taskId", "routes/task.tsx"),
    route("tasks/:taskId/edit", "routes/edit-task.tsx"),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
