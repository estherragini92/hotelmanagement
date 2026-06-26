import { useEffect, useState } from "react";
import { Headphones, Send, Trash2 } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

function CustomerSupport() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    const loadTickets = () => {
      const savedTickets = getCustomerData("hotelCustomerSupport");
      setTickets(savedTickets);
    };

    loadTickets();

    window.addEventListener("storage", loadTickets);
    window.addEventListener("hotelSupportUpdate", loadTickets);
    window.addEventListener("hotelRequestUpdate", loadTickets);

    return () => {
      window.removeEventListener("storage", loadTickets);
      window.removeEventListener("hotelSupportUpdate", loadTickets);
      window.removeEventListener("hotelRequestUpdate", loadTickets);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitTicket = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      alert("Please fill subject and message");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

    const newTicket = {
      id: Date.now(),
      guestName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "",
      roomNumber: "Customer Room",
      subject: formData.subject,
      type: "Support",
      task: "Support",
      message: formData.message,
      status: "Open",
      priority: "Medium",
      assignedTo: "Support Team",
      date: new Date().toLocaleDateString("en-IN"),
      source: "Customer Portal",
    };

    const customerTickets = getCustomerData("hotelCustomerSupport");

    const adminRequests =
      JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [];

    const updatedCustomerTickets = [...customerTickets, newTicket];
    const updatedAdminRequests = [...adminRequests, newTicket];

    setTickets(updatedCustomerTickets);

    setCustomerData("hotelCustomerSupport", updatedCustomerTickets);

    localStorage.setItem(
      "hotelCustomerRequests",
      JSON.stringify(updatedAdminRequests)
    );

    notifyHotelUpdate(
      HOTEL_EVENTS.REQUESTS,
      HOTEL_EVENTS.SUPPORT || "hotelSupportUpdate"
    );

    setFormData({
      subject: "",
      message: "",
    });

    alert("Support ticket sent to admin");
  };

  const deleteTicket = (id) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);

    setTickets(updatedTickets);
    setCustomerData("hotelCustomerSupport", updatedTickets);

    notifyHotelUpdate(HOTEL_EVENTS.SUPPORT || "hotelSupportUpdate");
  };

  const getStatusClass = (status) => {
    if (status === "Completed" || status === "Closed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress" || status === "Open") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Rejected" || status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Customer Support
        </h1>
        <p className="text-slate-500 mt-1">
          Send complaints, questions or help requests to hotel support.
        </p>
      </div>

      <form
        onSubmit={submitTicket}
        className="bg-white rounded-2xl p-6 border shadow-sm max-w-3xl"
      >
        <h2 className="text-xl font-bold mb-5">New Support Ticket</h2>

        <div className="grid gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="border rounded-xl px-4 py-3"
            value={formData.subject}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Explain your issue"
            className="border rounded-xl px-4 py-3 min-h-32"
            value={formData.message}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Submit Ticket
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="text-xl font-bold mb-5">My Support Tickets</h2>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl bg-slate-50 border p-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Headphones size={22} />
                </div>

                <div>
                  <h3 className="font-bold">{ticket.subject}</h3>
                  <p className="text-sm text-slate-500">{ticket.date}</p>
                  <p className="text-slate-600 mt-2">{ticket.message}</p>

                  <p className="text-sm text-slate-500 mt-2">
                    Assigned Staff: {ticket.assignedTo || "Support Team"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Priority: {ticket.priority || "Medium"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>

                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {tickets.length === 0 && (
            <p className="text-slate-500">No support tickets yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerSupport;