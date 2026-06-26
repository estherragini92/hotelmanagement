import { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    type: "Room Service",
    message: "",
  });

  useEffect(() => {
    const loadRequests = () => {
      const savedRequests = getCustomerData("hotelCustomerRequests");
      setRequests(savedRequests);
    };

    loadRequests();

    window.addEventListener("storage", loadRequests);
    window.addEventListener("hotelRequestUpdate", loadRequests);

    return () => {
      window.removeEventListener("storage", loadRequests);
      window.removeEventListener("hotelRequestUpdate", loadRequests);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRequest = (e) => {
    e.preventDefault();

    if (!formData.message) {
      alert("Please enter your request message");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

    const newRequest = {
      id: Date.now(),
      guestName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "",
      roomNumber: "Customer Room",
      type: formData.type,
      task: formData.type,
      message: formData.message,
      assignedTo: "Not Assigned",
      priority: "Medium",
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
      source: "Customer Portal",
    };

    const customerRequests = getCustomerData("hotelCustomerRequests");

    const adminRequests =
      JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [];

    const housekeepingTasks =
      JSON.parse(localStorage.getItem("hotelHousekeeping")) || [];

    const updatedCustomerRequests = [...customerRequests, newRequest];
    const updatedAdminRequests = [...adminRequests, newRequest];
    const updatedHousekeepingTasks = [...housekeepingTasks, newRequest];

    setRequests(updatedCustomerRequests);

    setCustomerData("hotelCustomerRequests", updatedCustomerRequests);

    localStorage.setItem(
      "hotelCustomerRequests",
      JSON.stringify(updatedAdminRequests)
    );

    localStorage.setItem(
      "hotelHousekeeping",
      JSON.stringify(updatedHousekeepingTasks)
    );

    notifyHotelUpdate(
      HOTEL_EVENTS.REQUESTS,
      HOTEL_EVENTS.HOUSEKEEPING
    );

    setFormData({
      type: "Room Service",
      message: "",
    });

    alert("Request sent to admin successfully");
  };

  const deleteRequest = (id) => {
    const updatedRequests = requests.filter((item) => item.id !== id);

    setRequests(updatedRequests);
    setCustomerData("hotelCustomerRequests", updatedRequests);

    notifyHotelUpdate(HOTEL_EVENTS.REQUESTS);
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Service Requests
        </h1>
        <p className="text-slate-500 mt-1">
          Send room service, cleaning or maintenance requests.
        </p>
      </div>

      <form
        onSubmit={submitRequest}
        className="bg-white rounded-2xl p-6 border shadow-sm max-w-3xl"
      >
        <h2 className="text-xl font-bold mb-5">New Request</h2>

        <div className="grid gap-4">
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

          <textarea
            name="message"
            placeholder="Enter your request message"
            className="border rounded-xl px-4 py-3 min-h-32"
            value={formData.message}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Submit Request
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="text-xl font-bold mb-5">My Requests</h2>

        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl bg-slate-50 border p-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <MessageSquare size={22} />
                </div>

                <div>
                  <h3 className="font-bold">{request.type}</h3>
                  <p className="text-sm text-slate-500">{request.date}</p>
                  <p className="text-slate-600 mt-2">{request.message}</p>

                  <p className="text-sm text-slate-500 mt-2">
                    Assigned Staff: {request.assignedTo || "Not Assigned"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Priority: {request.priority || "Medium"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

                <button
                  onClick={() => deleteRequest(request.id)}
                  className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <p className="text-slate-500">No requests submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerRequests;