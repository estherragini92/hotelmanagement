import { useEffect, useState } from "react";
import {
  Bell,
  CalendarCheck,
  Utensils,
  MessageSquare,
  Headphones,
  Receipt,
} from "lucide-react";

import { getCustomerData } from "../../utils/customerStorage";

function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    const bookings = getCustomerData("hotelCustomerBookings");
    const foodOrders = getCustomerData("hotelCustomerFoodOrders");
    const requests = getCustomerData("hotelCustomerRequests");
    const supportTickets = getCustomerData("hotelCustomerSupport");

    const user = JSON.parse(localStorage.getItem("hotelUser"));
    const invoices = JSON.parse(localStorage.getItem("hotelInvoices")) || [];

    const myInvoices = invoices.filter(
      (invoice) =>
        invoice.customerEmail === user?.email ||
        invoice.guestName === user?.name
    );

    const bookingNotes = bookings.map((item) => ({
      id: `booking-${item.id}`,
      rawId: item.id,
      icon: CalendarCheck,
      title: "Booking Update",
      message: `${item.roomType} room is ${item.status}. Payment: ${
        item.paymentStatus || "Pending"
      }`,
      date: item.date,
      status: item.status,
    }));

    const foodNotes = foodOrders.map((item) => ({
      id: `food-${item.id}`,
      rawId: item.id,
      icon: Utensils,
      title: "Food Order Update",
      message: `${item.item} order is ${item.status}. Payment: ${
        item.paymentStatus || "Pending"
      }`,
      date: item.date,
      status: item.status,
    }));

    const requestNotes = requests.map((item) => ({
      id: `request-${item.id}`,
      rawId: item.id,
      icon: MessageSquare,
      title: "Service Request Update",
      message: `${item.type} request is ${item.status}. Assigned: ${
        item.assignedTo || "Not Assigned"
      }`,
      date: item.date,
      status: item.status,
    }));

    const supportNotes = supportTickets.map((item) => ({
      id: `support-${item.id}`,
      rawId: item.id,
      icon: Headphones,
      title: "Support Ticket Update",
      message: `${item.subject} is ${item.status}. Assigned: ${
        item.assignedTo || "Support Team"
      }`,
      date: item.date,
      status: item.status,
    }));

    const invoiceNotes = myInvoices.map((item) => ({
      id: `invoice-${item.id}`,
      rawId: item.id,
      icon: Receipt,
      title: "Invoice Generated",
      message: `${item.invoiceNo} generated for ₹${Number(
        item.total || 0
      ).toLocaleString("en-IN")}`,
      date: item.date,
      status: item.paymentStatus,
    }));

    const latestNotifications = [
      ...bookingNotes,
      ...foodNotes,
      ...requestNotes,
      ...supportNotes,
      ...invoiceNotes,
    ]
      .sort((a, b) => Number(b.rawId) - Number(a.rawId))
      .slice(0, 15);

    setNotifications(latestNotifications);
  };

  useEffect(() => {
    loadNotifications();

    window.addEventListener("hotelBookingUpdate", loadNotifications);
    window.addEventListener("hotelFoodUpdate", loadNotifications);
    window.addEventListener("hotelRequestUpdate", loadNotifications);
    window.addEventListener("hotelSupportUpdate", loadNotifications);
    window.addEventListener("hotelInvoiceUpdate", loadNotifications);
    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("hotelBookingUpdate", loadNotifications);
      window.removeEventListener("hotelFoodUpdate", loadNotifications);
      window.removeEventListener("hotelRequestUpdate", loadNotifications);
      window.removeEventListener("hotelSupportUpdate", loadNotifications);
      window.removeEventListener("hotelInvoiceUpdate", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  const getStatusClass = (status) => {
    if (
      status === "Confirmed" ||
      status === "Delivered" ||
      status === "Completed" ||
      status === "Paid"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      status === "Preparing" ||
      status === "In Progress" ||
      status === "Open" ||
      status === "Checked In"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled" || status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">
            Latest booking, food, request, support and invoice updates.
          </p>
        </div>

        <button
          onClick={clearNotifications}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl w-fit"
        >
          Clear
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Bell size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Latest Updates</h2>
            <p className="text-sm text-slate-500">
              Showing latest {notifications.length} updates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-50 border p-5 flex gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Icon size={22} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h3 className="font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs w-fit ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1">{item.message}</p>

                  <p className="text-sm text-slate-400 mt-2">
                    {item.date || "No date"}
                  </p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="text-slate-500">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerNotifications;