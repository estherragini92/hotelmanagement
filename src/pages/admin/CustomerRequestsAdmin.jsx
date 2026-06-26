import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";

function CustomerRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    type: "",
    message: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    loadRequests();

    window.addEventListener("storage", loadRequests);
    window.addEventListener("hotelRequestUpdate", loadRequests);

    return () => {
      window.removeEventListener("storage", loadRequests);
      window.removeEventListener("hotelRequestUpdate", loadRequests);
    };
  }, []);

  const loadRequests = () => {
    const savedRequests =
      JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [];

    setRequests(savedRequests);
  };

  const saveRequests = (updatedRequests) => {
    setRequests(updatedRequests);

    localStorage.setItem(
      "hotelCustomerRequests",
      JSON.stringify(updatedRequests)
    );

    localStorage.setItem("hotelHousekeeping", JSON.stringify(updatedRequests));

    window.dispatchEvent(new Event("hotelRequestUpdate"));
    window.dispatchEvent(new Event("hotelHousekeepingUpdate"));
  };

  const handleEdit = (request) => {
    setEditId(request.id);

    setFormData({
      guestName: request.guestName || "",
      roomNumber: request.roomNumber || "",
      type: request.type || "",
      message: request.message || "",
      assignedTo: request.assignedTo || "",
      priority: request.priority || "Medium",
      status: request.status || "Pending",
    });

    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedRequests = requests.map((request) =>
      request.id === editId
        ? {
            ...request,
            ...formData,
            task: formData.type,
          }
        : request
    );

    saveRequests(updatedRequests);
    setShowForm(false);
    setEditId(null);
  };

  const markCompleted = (id) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: "Completed" } : request
    );

    saveRequests(updatedRequests);
  };

  const deleteRequest = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (confirmDelete) {
      const updatedRequests = requests.filter((request) => request.id !== id);
      saveRequests(updatedRequests);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      String(request.guestName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(request.roomNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(request.type || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(request.status || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(request.assignedTo || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const progressCount = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Customer Requests Center
        </h1>
        <p className="text-slate-500 mt-1">
          Manage all customer service requests, housekeeping, maintenance and
          support tickets.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Requests</p>
          <h2 className="text-3xl font-bold mt-2">{requests.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {progressCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {completedCount}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by customer, room, type, staff or status..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {request.type || request.task}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {request.date || "No Date"}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    request.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : request.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Customer:</strong> {request.guestName}
                </p>

                <p>
                  <strong>Room:</strong> {request.roomNumber}
                </p>

                <p>
                  <strong>Assigned Staff:</strong>{" "}
                  {request.assignedTo || "Not Assigned"}
                </p>

                <p>
                  <strong>Priority:</strong> {request.priority}
                </p>

                <p>
                  <strong>Message:</strong> {request.message}
                </p>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => markCompleted(request.id)}
                  className="flex-1 py-2 rounded-lg bg-green-100 text-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Done
                </button>

                <button
                  onClick={() => handleEdit(request)}
                  className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => deleteRequest(request.id)}
                  className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <p className="text-slate-500">No customer requests found.</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Update Request</h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="guestName"
                placeholder="Customer Name"
                className="border rounded-xl px-4 py-3"
                value={formData.guestName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                className="border rounded-xl px-4 py-3"
                value={formData.roomNumber}
                onChange={handleChange}
              />

              <select
                name="type"
                className="border rounded-xl px-4 py-3"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Room Service</option>
                <option>Housekeeping</option>
                <option>Maintenance</option>
                <option>Extra Towels</option>
                <option>Food Support</option>
                <option>Other</option>
              </select>

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
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <textarea
                name="message"
                placeholder="Request Message"
                className="border rounded-xl px-4 py-3 md:col-span-2 min-h-28"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerRequestsAdmin;