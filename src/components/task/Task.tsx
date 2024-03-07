import React, { useState } from "react";
import { Badge, Card } from "../ui";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import UpdateTaskDialog from "../home/UpdateTaskDialog";

export interface Task {
  assigned_to: {
    name: string;
    image: string | null;
    email: string;
  }[];
  id: number;
  title: string;
  description: string;
  due_date: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  assigned_to_id: string[];
  created_by_id: string;
  created_at: Date;
  updated_at: Date;
}
export type props = {
  task: Task;
  refetch: () => void;
};

const Task = ({ task , refetch}: props) => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">
            {task.title}
          </CardTitle>
          <Badge className="shrink-0">{task.priority}</Badge>
          <UpdateTaskDialog task={task} refetch={refetch} />
        </div>
        <CardDescription className="text-sm">
          Deadline:{" "}
          <time dateTime="2023-11-30">
            {new Date(task.due_date).toDateString()}
          </time>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-start gap-4 py-4">
        <div className="grid flex-1 gap-1">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm/relaxed">{task.description}</p>
        </div>
        <div className="ml-auto grid gap-1">
          <h3 className="font-semibold">Assigned to</h3>
          {task?.assigned_to.map((user) => (
            <div key={user.email} className="flex items-center gap-2">
              <Image
                alt={user.name}
                className="rounded-full"
                height="32"
                src={user.image ?? ""}
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
              <div className="grid gap-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Task;
