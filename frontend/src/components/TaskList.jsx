import { useEffect, useState } from "react";
import axios from "axios";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableTask({ task, deleteTask, updateStatus }) {

  const [editMode,setEditMode] = useState(false);
  const [editTitle,setEditTitle] = useState(task.title);
  const [editDesc,setEditDesc] = useState(task.description || "");
  const [editDeadline,setEditDeadline] = useState(
    task.deadline ? task.deadline.substring(0,10) : ""
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const saveEdit = async () => {

  await axios.put(
    `http://localhost:5000/api/tasks/${task._id}`,
    {
      title:editTitle,
      description:editDesc,
      deadline:editDeadline
    },
    {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  setEditMode(false);
  window.location.reload();

};

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow mb-3"
    >

      <div
        {...attributes}
        {...listeners}
        className="cursor-move text-gray-400 mb-2"
      >
        ⠿ Drag
      </div>

      {editMode ? (

<>
<input
  value={editTitle}
  onChange={(e)=>setEditTitle(e.target.value)}
  className="border p-1 rounded w-full"
/>

<textarea
  value={editDesc}
  onChange={(e)=>setEditDesc(e.target.value)}
  className="border p-1 rounded w-full mt-1"
/>

<input
  type="date"
  value={editDeadline}
  onChange={(e)=>setEditDeadline(e.target.value)}
  className="border p-1 rounded w-full mt-1"
/>

<button
  onClick={saveEdit}
  className="bg-green-500 text-white px-2 py-1 rounded mt-2"
>
Save
</button>

</>

) : (

<>
<h3 className="font-semibold">{task.title}</h3>

<button
  onClick={()=>setEditMode(true)}
  className="text-blue-500 text-sm"
>
Edit
</button>
</>

)}

      <p className="text-sm text-gray-600">
        {task.description}
      </p>

      <p className="text-xs text-gray-400">
        {task.deadline ? new Date(task.deadline).toLocaleDateString() : ""}
      </p>

      <p className="text-sm text-gray-500 mb-2">
        Priority: {task.priority}
      </p>

      <select
        value={task.status}
        onChange={(e)=>updateStatus(task._id,e.target.value)}
        className="border p-1 rounded mb-2"
      >
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <br/>

      <button
        onClick={()=>deleteTask(task._id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>

    </div>

  );
}

function Column({
  title,
  color,
  tasks,
  deleteTask,
  updateStatus,
  updatePriority
}) {

  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {

      const oldIndex = tasks.findIndex(t => t._id === active.id);
      const newIndex = tasks.findIndex(t => t._id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);

      updatePriority(newTasks);

    }

  };

  return (

    <div className={`${color} p-4 rounded-lg min-h-[400px]`}>

      <h2 className="font-bold mb-4">{title}</h2>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={tasks.map(t=>t._id)}
          strategy={verticalListSortingStrategy}
        >

          {tasks.map(task => (

            <SortableTask
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              updateStatus={updateStatus}
            />

          ))}

        </SortableContext>

      </DndContext>

    </div>

  );
}

function TaskList() {

  const [tasks,setTasks] = useState([]);
  const [search,setSearch] = useState("");
  const [newTaskTitle,setNewTaskTitle] = useState("");
  const [filter,setFilter] = useState("all");
  const [description,setDescription] = useState("");
  const [deadline,setDeadline] = useState("");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/tasks",
      {
        headers:{Authorization:`Bearer ${token}`}
      }
    );

    setTasks(res.data.tasks);

  };

  useEffect(()=>{
    fetchTasks();
  },[]);

  const createTask = async () => {

    if(!newTaskTitle.trim()) return;

    await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title:newTaskTitle,
        description,
        deadline
      },
      {
        headers:{Authorization:`Bearer ${token}`}
      }
    );

    setNewTaskTitle("");
    setDescription("");
    setDeadline("");
    fetchTasks();

  };

  const deleteTask = async (id) => {

  await axios.delete(
    `http://localhost:5000/api/tasks/${id}`,
    {
      headers:{Authorization:`Bearer ${token}`}
    }
  );

  await axios.put(
    "http://localhost:5000/api/tasks/reorder",
    {},
    {
      headers:{Authorization:`Bearer ${token}`}
    }
  );

  fetchTasks();

};

  const updateStatus = async (id,status) => {

  await axios.put(
    `http://localhost:5000/api/tasks/${id}`,
    {status},
    {
      headers:{Authorization:`Bearer ${token}`}
    }
  );

  await axios.put(
    "http://localhost:5000/api/tasks/reorder",
    {},
    {
      headers:{Authorization:`Bearer ${token}`}
    }
  );

  fetchTasks();

};

  const updatePriority = async (tasksArray) => {

    for(let i=0;i<tasksArray.length;i++){

      await axios.put(
        `http://localhost:5000/api/tasks/${tasksArray[i]._id}/priority`,
        {newPriority:i+1},
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      );

    }

    fetchTasks();

  };

  const logout = ()=>{
    localStorage.removeItem("token");
    window.location.reload();
  };

  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if(filter!=="all"){
    filteredTasks = filteredTasks.filter(t=>t.status===filter);
  }

  const pending = filteredTasks.filter(t=>t.status==="pending");
  const progress = filteredTasks.filter(t=>t.status==="inprogress");
  const completed = filteredTasks.filter(t=>t.status==="completed");

  return(

    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          TaskFlow Dashboard
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
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e)=>setNewTaskTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e)=>setDeadline(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>

      </div>
      <div className="grid grid-cols-3 gap-6">

        <Column
          title="Pending"
          color="bg-yellow-100"
          tasks={pending}
          deleteTask={deleteTask}
          updateStatus={updateStatus}
          updatePriority={updatePriority}
        />

        <Column
          title="In Progress"
          color="bg-blue-100"
          tasks={progress}
          deleteTask={deleteTask}
          updateStatus={updateStatus}
          updatePriority={updatePriority}
        />

        <Column
          title="Completed"
          color="bg-green-100"
          tasks={completed}
          deleteTask={deleteTask}
          updateStatus={updateStatus}
          updatePriority={updatePriority}
        />

      </div>
    </div>

  );

}

export default TaskList;