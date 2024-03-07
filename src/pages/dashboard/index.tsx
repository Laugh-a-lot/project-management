import React from "react";
import Task from "~/components/task/Task";
import { api } from "~/utils/api";


const index = () => {

  
  const { data: tasks, isLoading , refetch} = api.task.getTaskByUser.useQuery();
  const { data: assignedTasks , isLoading: isAssignedLoading} = api.task.getAssignedTask.useQuery();

  return (
    <>
      <div className="flex py-2">
        <span className="text-xl font-bold text-white">
          My Tasks ({tasks?.length ?? 0})
        </span>
      </div>
      <div className="grid gap-4">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => <Task task={task} key={task.id} refetch={refetch}/>)
        ) : (
          <span className="mt-40 text-center align-middle text-xl text-white">
            {isLoading ? "Loading..." : "No tasks available"}
          </span>
        )}
      </div>
      <div className="flex py-2">
        <span className="text-xl font-bold text-white">
          Assigned Tasks ({assignedTasks?.length ?? 0})
        </span>
      </div>
      <div className="grid gap-4">
        {Array.isArray(assignedTasks) && assignedTasks.length > 0 ? (
          assignedTasks.map((task) => <Task task={task} key={task.id} refetch={refetch} />)
        ) : (
          <span className="mt-40 text-center align-middle text-xl text-white">
            {isAssignedLoading ? "Loading..." : "No tasks available"}
          </span>
        )}
      </div>
    </>
  );
};

export default index;
