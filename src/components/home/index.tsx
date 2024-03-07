import CreateNewTaskDialog from "./CreateNewTaskDialog";
import { api } from "~/utils/api";
import Image from "next/image";
import Task from "../task/Task";

export default function HomePage() {
  const { data: tasks, isLoading, refetch } = api.task.getTaskByUser.useQuery();
  return (
    <>
      <div className="flex justify-end py-2">
        <span className="text-xl font-bold text-white">
          My Tasks ({tasks?.length ?? 0})
        </span>
        <CreateNewTaskDialog refetch={refetch} />
      </div>
      <div className="grid gap-4">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => <Task task={task} key={task.id} refetch={refetch} />)
        ) : (
          <span className="mt-40 text-center align-middle text-xl text-white">
            {isLoading ? "Loading..." : "No tasks available"}
          </span>
        )}
      </div>
    </>
  );
}
