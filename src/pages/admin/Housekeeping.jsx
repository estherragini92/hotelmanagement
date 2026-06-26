import { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";

const defaultTasks = [
  {
    id: 1,
    roomNumber: "204",
    task: "Room Cleaning",
    assignedTo: "Ravi",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    roomNumber: "501",
    task: "Bedsheet Change",
    assignedTo: "Meena",
    priority: "Medium",
    status: "Completed",
  },
];

function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    task: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("hotelHousekeeping"));

    if (savedTasks && savedTasks.length > 0) {
      setTasks(savedTasks);
    } else {
      setTasks(defaultTasks);
      localStorage.setItem("hotelHousekeeping", JSON.stringify(defaultTasks));
    }
  };

  loadTasks();

  window.addEventListener("storage", loadTasks);
  window.addEventListener("hotelHousekeepingUpdate", loadTasks);

  return () => {
    window.removeEventListener("storage", loadTasks);
    window.removeEventListener("hotelHousekeepingUpdate", loadTasks);
  };
}, []);

 const saveTasks = (updatedTasks) => {
  setTasks(updatedTasks);
  localStorage.setItem("hotelHousekeeping", JSON.stringify(updatedTasks));

  const customerRequests =
    JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [];

  const syncedCustomerRequests = customerRequests.map((request) => {
    const matchedTask = updatedTasks.find((task) => task.id === request.id);

    return matchedTask
      ? { ...request, ...matchedTask }
      : request;
  });

  localStorage.setItem(
    "hotelCustomerRequests",
    JSON.stringify(syncedCustomerRequests)
  );

  window.dispatchEvent(new Event("hotelRequestUpdate"));
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({
      roomNumber: "",
      task: "",
      assignedTo: "",
      priority: "Medium",
      status: "Pending",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.roomNumber || !formData.task || !formData.assignedTo) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editId ? { ...task, ...formData } : task
      );

      saveTasks(updatedTasks);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
      };

      saveTasks([...tasks, newTask]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setFormData(task);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      saveTasks(updatedTasks);
    }
  };

  const markCompleted = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );

    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      task.task.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      task.status.toLowerCase().includes(search.toLowerCase())
  );

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Housekeeping</h1>
          <p className="text-slate-500 mt-1">
            Assign cleaning tasks and track room service status.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <h2 className="text-3xl font-bold mt-2">{tasks.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {pendingTasks}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {completedTasks}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by room, task, staff or status..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border bg-slate-50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Sparkles size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">Room {task.roomNumber}</h3>
                    <p className="text-sm text-slate-500">{task.task}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>Assigned To: {task.assignedTo}</p>
                <p>Priority: {task.priority}</p>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => markCompleted(task.id)}
                  className="flex-1 py-2 rounded-lg bg-green-100 text-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Done
                </button>

                <button
                  onClick={() => handleEdit(task)}
                  className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <p className="text-slate-500">No housekeeping tasks found</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editId ? "Edit Task" : "Add Task"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                className="border rounded-xl px-4 py-3"
                value={formData.roomNumber}
                onChange={handleChange}
              />

              <input
                type="text"
                name="task"
                placeholder="Task Name"
                className="border rounded-xl px-4 py-3"
                value={formData.task}
                onChange={handleChange}
              />

              <input
                type="text"
                name="assignedTo"
                placeholder="Assigned Staff"
                className="border rounded-xl px-4 py-3"
                value={formData.assignedTo}
                onChange={handleChange}
              />

              <select
                name="priority"
                className="border rounded-xl px-4 py-3"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <select
                name="status"
                className="border rounded-xl px-4 py-3"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Task" : "Save Task"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Housekeeping;