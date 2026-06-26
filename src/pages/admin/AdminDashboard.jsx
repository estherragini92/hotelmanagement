import { useEffect, useState } from "react";
import {
  BedDouble,
  CalendarCheck,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Utensils,
  MessageSquare,
  Receipt,
} from "lucide-react";

function AdminDashboard() {
  const [data, setData] = useState({
    rooms: [],
    bookings: [],
    foodOrders: [],
    payments: [],
    requests: [],
    housekeeping: [],
    invoices: [],
  });

  const loadDashboard = () => {
    setData({
      rooms: JSON.parse(localStorage.getItem("hotelRooms")) || [],
      bookings: JSON.parse(localStorage.getItem("hotelBookings")) || [],
      foodOrders: JSON.parse(localStorage.getItem("hotelFoodOrders")) || [],
      payments: JSON.parse(localStorage.getItem("hotelPayments")) || [],
      requests: JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [],
      housekeeping: JSON.parse(localStorage.getItem("hotelHousekeeping")) || [],
      invoices: JSON.parse(localStorage.getItem("hotelInvoices")) || [],
    });
  };

  useEffect(() => {
    loadDashboard();

    const events = [
      "storage",
      "hotelRoomUpdate",
      "hotelBookingUpdate",
      "hotelFoodUpdate",
      "hotelPaymentUpdate",
      "hotelRequestUpdate",
      "hotelHousekeepingUpdate",
      "hotelInvoiceUpdate",
    ];

    events.forEach((event) => window.addEventListener(event, loadDashboard));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, loadDashboard)
      );
    };
  }, []);

  const availableRooms = data.rooms.filter(
    (room) => room.status === "Available" || room.status === "Vacant"
  ).length;

  const occupiedRooms = data.rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const cleaningRooms = data.rooms.filter(
    (room) => room.status === "Cleaning"
  ).length;

  const maintenanceRooms = data.rooms.filter(
    (room) => room.status === "Maintenance"
  ).length;

  const checkedIn = data.bookings.filter(
    (booking) => booking.status === "Checked In"
  ).length;

  const checkedOut = data.bookings.filter(
    (booking) => booking.status === "Checked Out"
  ).length;

  const pendingBookings = data.bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const paidPayments = data.payments.filter(
    (payment) => payment.status === "Paid"
  );

  const totalRevenue = paidPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const pendingRequests = data.requests.filter(
    (request) =>
      request.status === "Pending" || request.status === "Open"
  ).length;

  const foodOrdersToday = data.foodOrders.length;

  const deliveredFood = data.foodOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const stats = [
    {
      title: "Total Rooms",
      value: data.rooms.length,
      icon: BedDouble,
      change: `${availableRooms} available`,
    },
    {
      title: "Total Bookings",
      value: data.bookings.length,
      icon: CalendarCheck,
      change: `${pendingBookings} pending`,
    },
    {
      title: "Active Guests",
      value: checkedIn,
      icon: Users,
      change: `${checkedOut} checked out`,
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: CreditCard,
      change: `${paidPayments.length} paid payments`,
    },
  ];

  const roomStatus = [
    { type: "Available", count: availableRooms },
    { type: "Occupied", count: occupiedRooms },
    { type: "Cleaning", count: cleaningRooms },
    { type: "Maintenance", count: maintenanceRooms },
  ];

  const recentBookings = [...data.bookings]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const activities = [
    ...data.bookings.map((item) => ({
      id: `booking-${item.id}`,
      rawId: item.id,
      text: `${item.guestName} booked ${item.roomType || "Room"} ${
        item.roomNumber || ""
      }`,
    })),
    ...data.foodOrders.map((item) => ({
      id: `food-${item.id}`,
      rawId: item.id,
      text: `${item.guestName} ordered ${item.item}`,
    })),
    ...data.requests.map((item) => ({
      id: `request-${item.id}`,
      rawId: item.id,
      text: `${item.guestName} requested ${item.type || item.task}`,
    })),
    ...data.payments.map((item) => ({
      id: `payment-${item.id}`,
      rawId: item.id,
      text: `${item.guestName} paid ₹${Number(item.amount || 0).toLocaleString(
        "en-IN"
      )}`,
    })),
    ...data.invoices.map((item) => ({
      id: `invoice-${item.id}`,
      rawId: item.id,
      text: `${item.invoiceNo} generated for ${item.guestName}`,
    })),
  ]
    .sort((a, b) => Number(b.rawId) - Number(a.rawId))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Live hotel operations, bookings, rooms, requests and revenue.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                </div>

                <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Icon size={26} />
                </div>
              </div>

              <p className="text-sm text-green-600 mt-4 flex items-center gap-1">
                <TrendingUp size={15} />
                {item.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Food Orders</p>
          <h2 className="text-3xl font-bold mt-2">{foodOrdersToday}</h2>
          <p className="text-sm text-slate-500 mt-2">
            {deliveredFood} delivered
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Pending Requests</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {pendingRequests}
          </h2>
          <p className="text-sm text-slate-500 mt-2">Customer requests</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Invoices</p>
          <h2 className="text-3xl font-bold mt-2">{data.invoices.length}</h2>
          <p className="text-sm text-slate-500 mt-2">Generated bills</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Housekeeping</p>
          <h2 className="text-3xl font-bold mt-2">
            {data.housekeeping.length}
          </h2>
          <p className="text-sm text-slate-500 mt-2">Total tasks</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-5">Room Status</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {roomStatus.map((room) => (
              <div key={room.type} className="rounded-xl bg-slate-100 p-5">
                <p className="text-slate-500 text-sm">{room.type}</p>
                <h3 className="text-3xl font-bold mt-2">{room.count}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5">Today Summary</h2>

          <div className="space-y-5">
            <div>
              <p className="text-slate-400 text-sm">Checked In</p>
              <h3 className="text-2xl font-bold">{checkedIn} Guests</h3>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Checked Out</p>
              <h3 className="text-2xl font-bold">{checkedOut} Guests</h3>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Pending Cleaning</p>
              <h3 className="text-2xl font-bold">{cleaningRooms} Rooms</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-5">Recent Bookings</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{booking.guestName}</td>
                    <td className="py-4">
                      {booking.roomType || "Room"} - {booking.roomNumber}
                    </td>
                    <td className="py-4">{booking.date || booking.checkIn}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">
                      No recent bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-5">Recent Activity</h2>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <Clock size={17} />
                </div>

                <p className="text-sm text-slate-600 pt-2">{activity.text}</p>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="text-slate-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;