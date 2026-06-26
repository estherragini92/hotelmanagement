import { generateInvoiceForBooking } from "../../utils/invoiceUtils";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const defaultBookings = [
  {
    id: 1,
    guestName: "Arun Kumar",
    roomNumber: "204",
    checkIn: "2026-06-24",
    checkOut: "2026-06-26",
    guests: 2,
    status: "Confirmed",
    amount: 9000,
    paymentStatus: "Pending",
    source: "Admin",
  },
  {
    id: 2,
    guestName: "Priya Sharma",
    roomNumber: "501",
    checkIn: "2026-07-02",
    checkOut: "2026-07-04",
    guests: 3,
    status: "Pending",
    amount: 17000,
    paymentStatus: "Pending",
    source: "Admin",
  },
];

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    status: "Pending",
    amount: "",
    paymentStatus: "Pending",
  });

  useEffect(() => {
    const loadBookings = () => {
      const savedBookings = JSON.parse(localStorage.getItem("hotelBookings"));

      if (savedBookings && savedBookings.length > 0) {
        setBookings(savedBookings);
      } else {
        setBookings(defaultBookings);
        localStorage.setItem("hotelBookings", JSON.stringify(defaultBookings));
      }
    };

    loadBookings();

    window.addEventListener("storage", loadBookings);
    window.addEventListener("hotelBookingUpdate", loadBookings);

    return () => {
      window.removeEventListener("storage", loadBookings);
      window.removeEventListener("hotelBookingUpdate", loadBookings);
    };
  }, []);

  const syncCustomerBookings = (updatedBookings) => {
    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (key.startsWith("hotelCustomerBookings_")) {
        const customerBookings = JSON.parse(localStorage.getItem(key)) || [];

        const syncedCustomerBookings = customerBookings.map((customerBooking) => {
          const matchedBooking = updatedBookings.find(
            (booking) => booking.id === customerBooking.id
          );

          return matchedBooking
            ? { ...customerBooking, ...matchedBooking }
            : customerBooking;
        });

        localStorage.setItem(key, JSON.stringify(syncedCustomerBookings));
      }
    });

    const oldCustomerBookings =
      JSON.parse(localStorage.getItem("hotelCustomerBookings")) || [];

    if (oldCustomerBookings.length > 0 || currentUser?.role === "customer") {
      const syncedOldCustomerBookings = oldCustomerBookings.map(
        (customerBooking) => {
          const matchedBooking = updatedBookings.find(
            (booking) => booking.id === customerBooking.id
          );

          return matchedBooking
            ? { ...customerBooking, ...matchedBooking }
            : customerBooking;
        }
      );

      localStorage.setItem(
        "hotelCustomerBookings",
        JSON.stringify(syncedOldCustomerBookings)
      );
    }
  };

  const updateRoomStatusFromBookings = (updatedBookings) => {
    const rooms = JSON.parse(localStorage.getItem("hotelRooms")) || [];

    const updatedRooms = rooms.map((room) => {
      const activeBooking = updatedBookings.find(
        (booking) =>
          String(booking.roomNumber) === String(room.roomNumber) &&
          booking.status !== "Cancelled" &&
          booking.status !== "Checked Out"
      );

      const checkedOutBooking = updatedBookings.find(
        (booking) =>
          String(booking.roomNumber) === String(room.roomNumber) &&
          booking.status === "Checked Out"
      );

      if (activeBooking) {
        return {
          ...room,
          status: "Occupied",
        };
      }

      if (checkedOutBooking) {
        return {
          ...room,
          status: "Available",
        };
      }

      return room;
    });

    localStorage.setItem("hotelRooms", JSON.stringify(updatedRooms));
  };

  const saveBookings = (updatedBookings) => {
    setBookings(updatedBookings);
    localStorage.setItem("hotelBookings", JSON.stringify(updatedBookings));

    syncCustomerBookings(updatedBookings);
    updateRoomStatusFromBookings(updatedBookings);

    window.dispatchEvent(new Event("hotelBookingUpdate"));
    window.dispatchEvent(new Event("hotelRoomUpdate"));
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
      guestName: "",
      roomNumber: "",
      checkIn: "",
      checkOut: "",
      guests: "",
      status: "Pending",
      amount: "",
      paymentStatus: "Pending",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.guestName ||
      !formData.roomNumber ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.guests ||
      !formData.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === editId
          ? {
              ...booking,
              ...formData,
              guests: Number(formData.guests),
              amount: Number(formData.amount),
              price: Number(formData.amount),
            }
          : booking
      );

      saveBookings(updatedBookings);
    } else {
      const newBooking = {
        id: Date.now(),
        ...formData,
        guests: Number(formData.guests),
        amount: Number(formData.amount),
        price: Number(formData.amount),
        source: "Admin",
      };

      saveBookings([...bookings, newBooking]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (booking) => {
    setEditId(booking.id);

    setFormData({
      guestName: booking.guestName || "",
      roomNumber: booking.roomNumber || "",
      checkIn: booking.checkIn || "",
      checkOut: booking.checkOut || "",
      guests: booking.guests || "",
      status: booking.status || "Pending",
      amount: booking.amount || booking.price || "",
      paymentStatus: booking.paymentStatus || "Pending",
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (confirmDelete) {
      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      saveBookings(updatedBookings);
    }
  };

  const updateBookingStatus = (id, status) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking
    );

    saveBookings(updatedBookings);
  };

  const checkIn = (id) => {
    updateBookingStatus(id, "Checked In");
  };
const checkOut = (id) => {
  const booking = bookings.find((item) => item.id === id);

  if (!booking) return;

  if (booking.paymentStatus !== "Paid") {
    alert("Customer must complete payment before checkout.");
    return;
  }

  const updatedBookings = bookings.map((item) =>
    item.id === id ? { ...item, status: "Checked Out" } : item
  );

  saveBookings(updatedBookings);

  generateInvoiceForBooking({
    ...booking,
    status: "Checked Out",
  });

  alert("Checkout completed and invoice generated.");
};

  const cancelBooking = (id) => {
    updateBookingStatus(id, "Cancelled");
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      String(booking.guestName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(booking.roomNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(booking.status || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(booking.paymentStatus || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const checkedInBookings = bookings.filter(
    (booking) => booking.status === "Checked In"
  ).length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  ).length;

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.amount || booking.price || 0),
    0
  );

  const getStatusClass = (status) => {
    if (status === "Confirmed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Checked In") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Checked Out") {
      return "bg-slate-200 text-slate-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const getPaymentClass = (status) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Bookings Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage reservations, check-ins, check-outs and payment status.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Booking
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{totalBookings}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Confirmed</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {confirmedBookings}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Checked In</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {checkedInBookings}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Paid Bookings</p>
          <h2 className="text-3xl font-bold mt-2 text-emerald-600">
            {paidBookings}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by guest, room, status or payment..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1050px]">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-3">Guest</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Check In</th>
                <th className="pb-3">Check Out</th>
                <th className="pb-3">Guests</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Booking</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Source</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={18} />
                      <div>
                        <p>{booking.guestName}</p>
                        {booking.customerEmail && (
                          <p className="text-xs text-slate-500">
                            {booking.customerEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    {booking.roomNumber}
                    {booking.requestedRoomNumber && (
                      <p className="text-xs text-slate-500">
                        Requested: {booking.requestedRoomNumber}
                      </p>
                    )}
                  </td>

                  <td className="py-4">{booking.checkIn || "Not Added"}</td>
                  <td className="py-4">{booking.checkOut || "Not Added"}</td>
                  <td className="py-4">{booking.guests}</td>

                  <td className="py-4">
                    ₹
                    {Number(
                      booking.amount || booking.price || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getPaymentClass(
                        booking.paymentStatus || "Pending"
                      )}`}
                    >
                      {booking.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="text-xs text-slate-500">
                      {booking.source || "Admin"}
                    </span>
                  </td>

                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "Confirmed" && (
                        <button
                          onClick={() => checkIn(booking.id)}
                          className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                        >
                          Check In
                        </button>
                      )}

                      {booking.status === "Checked In" && (
                        <button
                          onClick={() => checkOut(booking.id)}
                          className="px-3 py-1 rounded bg-purple-600 text-white text-xs"
                        >
                          Check Out
                        </button>
                      )}

                      {booking.status !== "Cancelled" &&
                        booking.status !== "Checked Out" && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                          >
                            Cancel
                          </button>
                        )}

                      <button
                        onClick={() => handleEdit(booking)}
                        className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-slate-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-5 border">
          <p className="text-sm text-slate-500">Booking Revenue</p>
          <h2 className="text-2xl font-bold mt-1">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editId ? "Edit Booking" : "Add Booking"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="guestName"
                placeholder="Guest Name"
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

              <input
                type="date"
                name="checkIn"
                className="border rounded-xl px-4 py-3"
                value={formData.checkIn}
                onChange={handleChange}
              />

              <input
                type="date"
                name="checkOut"
                className="border rounded-xl px-4 py-3"
                value={formData.checkOut}
                onChange={handleChange}
              />

              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                className="border rounded-xl px-4 py-3"
                value={formData.guests}
                onChange={handleChange}
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className="border rounded-xl px-4 py-3"
                value={formData.amount}
                onChange={handleChange}
              />

              <select
                name="status"
                className="border rounded-xl px-4 py-3"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Checked In</option>
                <option>Checked Out</option>
                <option>Cancelled</option>
              </select>

              <select
                name="paymentStatus"
                className="border rounded-xl px-4 py-3"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Refunded</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Booking" : "Save Booking"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Bookings;