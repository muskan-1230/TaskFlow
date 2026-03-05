import { useEffect, useState } from "react";
import axios from "axios";

import {
  DndContext,
  closestCenter,
  useDroppable
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableTask({ task, handleDelete }) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow border mb-3"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 mb-2"
      >
        ⠿ Drag
      </div>

      <h3 className="font-semibold">{task.title}</h3>

      <p className="text-sm text-gray-500">
        Priority: {task.priority}
      </p>

      <button
        onClick={() => handleDelete(task._id)}
        className="bg-red-500 text-white px-3 py-1 rounded mt-2"
      >
        Delete
      </button>
    </div>
  );
}

function Column({ id, title, color, tasks, handleDelete }) {

  const { setNodeRef } = useDroppable({
    id: id
  });

  return (
    <div
      ref={setNodeRef}
      className={`${color} p-4 rounded-lg min-h-[400px]`}
    >

      <h2 className="font-bold mb-4">{title}</h2>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >

        {tasks.map((task) => (
          <SortableTask
            key={task._id}
            task={task}
            handleDelete={handleDelete}
          />
        ))}

      </SortableContext>

    </div>
  );
}

function TaskList() {

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {

    if (!newTaskTitle.trim()) return;

    await axios.post(
      "http://localhost:5000/api/tasks",
      { title: newTaskTitle },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setNewTaskTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {

    await axios.delete(
      `http://localhost:5000/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks();
  };

  const updateStatus = async (id, status) => {

    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks();
  };

  const handleDragEnd = async (event) => {

    const { active, over } = event;

    if (!over) return;

    const draggedTask = tasks.find(t => t._id === active.id);

    if (!draggedTask) return;

    const newStatus = over.id;

    if (draggedTask.status !== newStatus) {

      await updateStatus(active.id, newStatus);

    }

  };

  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter !== "all") {

    filteredTasks = filteredTasks.filter(
      task => task.status === filter
    );

  }

  const pending = filteredTasks.filter(t => t.status === "pending");
  const progress = filteredTasks.filter(t => t.status === "inprogress");
  const completed = filteredTasks.filter(t => t.status === "completed");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (

    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Task Board
        </h1>

        <button
          onClick={logout}
          className="text-red-500"
        >
          Logout
        </button>

      </div>

      <div className="flex gap-3 mb-6">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="New task"
          value={newTaskTitle}
          onChange={(e)=>setNewTaskTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <div className="grid grid-cols-3 gap-6">

          <Column
            id="pending"
            title="Pending"
            color="bg-yellow-100"
            tasks={pending}
            handleDelete={deleteTask}
          />

          <Column
            id="inprogress"
            title="In Progress"
            color="bg-blue-100"
            tasks={progress}
            handleDelete={deleteTask}
          />

          <Column
            id="completed"
            title="Completed"
            color="bg-green-100"
            tasks={completed}
            handleDelete={deleteTask}
          />

        </div>

      </DndContext>

    </div>

  );

}

export default TaskList;