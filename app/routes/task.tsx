import { Form, redirect, useFetcher } from "react-router";

import { deleteTask, getTask, updatedTask, type TaskRecord } from "../data";
import type { Route } from "./+types/task";

export async function loader({ params }: Route.LoaderArgs) {
  const task = await getTask(params.taskId);
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }

  return { task };
}

export async function action({ params, request }: Route.ActionArgs) {
  if (request.method === "DELETE") {
    await deleteTask(params.taskId);
    return redirect(`/`);
  }

  const formData = await request.formData();

  return updatedTask(params.taskId, {
    completed: formData.get("completed") === "true",
  });
}

export default function Task({
  loaderData,
}: Route.ComponentProps) {
  const { task } = loaderData;
  const fetcher = useFetcher();

  return (
    <div id="task">
      <div>
        <h1 className='flex flex-row items-center gap-2'>
          {task.name}
          <Completed task={task} />
        </h1>


        {task.description ? <p>{task.description}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <fetcher.Form
            method="DELETE"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

function Completed({
  task,
}: {
  task: Pick<TaskRecord, "completed">;
}) {
  const fetcher = useFetcher();
  const completed = fetcher.formData
    ? fetcher.formData.get("completed") === "true"
    : task.completed;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          completed
            ? "Mark as incomplete"
            : "Mark as complete"
        }
        name="completed"
        value={completed ? "false" : "true"}
      >
        {completed ? "✅" : "❌"}
      </button>
    </fetcher.Form>
  );
};
