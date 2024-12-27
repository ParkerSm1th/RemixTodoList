import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSubmit,
} from "react-router";
import { getTasks } from "../data";
import type { Route } from "./+types/sidebar";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const tasks = await getTasks(q);
  return { tasks, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { tasks, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Todo List</h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              defaultValue={q || ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {tasks.length ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className={task.completed ? "completed" : ""}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`tasks/${task.id}`}
                  >
                    {task.name ?? <i>Untitled Task</i>}
                    {task.completed ? <span>✅</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No tasks</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
