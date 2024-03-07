import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import { PlusIcon } from "lucide-react";
import { MultiSelectInput, type Option } from "../ui/custom-multiple-select";
import { api } from "~/utils/api";

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  tags: string;
  assignedTo: Option[];
}

export default function CreateNewTaskDialog({
  refetch,
}: {
  refetch: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    tags: "",
    assignedTo: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [userOption, setUserOptions] = useState<Option[]>([]);
  const { data: userList } = api.user.getAllUser.useQuery();
  const { mutate } = api.task.create.useMutation();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriorityChange = (value: "low" | "medium" | "high") => {
    setFormData({ ...formData, priority: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here, you can send the formData to your server or perform any other necessary actions
    const { title, description, tags, dueDate, priority } = formData;
    const createNewTask = {
      title,
      description,
      tags: tags.split(",").map((tag) => tag.trim()),
      assignedTo: userOption
        .filter(({ value, checked }) => checked)
        .map(({ value }) => value),
      dueDate: new Date(dueDate).toISOString(),
      priority,
    };
    mutate(createNewTask, {
      onSuccess: () => {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          priority: "medium",
          tags: "",
          assignedTo: [],
        });
        setIsOpen(false);
        refetch();
      },
    });

    // Reset the form after submission
  };

  useEffect(() => {
    if (userList)
      setUserOptions(
        userList?.map((user) => ({
          label: user.name || user.email || "",
          value: user.id,
          checked: false,
        })),
      );
  }, [userList]);

  return (
    <Dialog key="1" open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          className="ml-auto "
          size="sm"
          variant={"outline"}
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto h-[80vh] p-8 sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Enter the details of the new task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid w-full gap-4">
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter the task title."
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[100px]"
              id="description"
              required
              name="description"
              placeholder="Enter the task description."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              className="h-10"
              id="due-date"
              name="dueDate"
              required
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label>Priority</Label>
            <div className="flex items-center gap-2">
              <RadioGroup
                value={formData.priority}
                onValueChange={handlePriorityChange}
                className="flex items-center"
                required
              >
                <RadioGroupItem value="low" />
                <label
                  className="flex cursor-pointer items-center gap-2"
                  htmlFor="priority-low"
                >
                  Low
                </label>
                <RadioGroupItem value="medium" />
                <label
                  className="flex cursor-pointer items-center gap-2"
                  htmlFor="priority-medium"
                >
                  Medium
                </label>
                <RadioGroupItem value="high" />
                <label
                  className="flex cursor-pointer items-center gap-2"
                  htmlFor="priority-high"
                >
                  High
                </label>
              </RadioGroup>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              required
              name="tags"
              placeholder="Enter tags separated by commas."
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <Label>Assigned To</Label>
            <MultiSelectInput
              options={userOption}
              placeholder="Select Users"
              setOptions={setUserOptions}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
