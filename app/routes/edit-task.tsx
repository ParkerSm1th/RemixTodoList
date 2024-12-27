import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/edit-task";
import { getTask, updatedTask } from "../data";

export async function loader({ params }: Route.LoaderArgs) {
  const task = await getTask(params.taskId);
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return { task };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatedTask(params.taskId, updates);
  return redirect(`/tasks/${params.taskId}`);
}

export default function EditTask({ loaderData }: Route.ComponentProps) {
  const { task } = loaderData;
  const navigate = useNavigate();

  return (
    <Form key={task.id} id="task-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={task.name}
          name="name"
          placeholder="Task Name"
          type="text"
        />
      </p>
      <label>
        <span>Description</span>
        <textarea defaultValue={task.description} name="description" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
