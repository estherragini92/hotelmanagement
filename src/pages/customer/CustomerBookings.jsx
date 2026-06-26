import { useEffect, useState } from "react";
import { CalendarCheck, Trash2 } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = () => {
      const savedBookings = getCustomerData("hotelCustomerBookings");
      setBookings(savedBookings);
    };

    loadBookings();

    window.addEventListener("storage", loadBookings);
    window.addEventListener("hotelBookingUpdate", loadBookings);

    return () => {
      window.removeEventListener("storage", loadBookings);
      window.removeEventListener("hotelBookingUpdate", loadBookings);
    };
  }, []);

  const saveCustomerBookings = (updatedBookings) => {
    setBookings(updatedBookings);
    setCustomerData("hotelCustomerBookings", updatedBookings);
    notifyHotelUpdate(HOTEL_EVENTS.BOOKINGS);
  };

  const cancelBooking = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "Cancelled" } : booking
    );

    saveCustomerBookings(updatedBookings);
  };

  const deleteBooking = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (confirmDelete) {
      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      saveCustomerBookings(updatedBookings);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1">
          View your room booking requests and status.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl p-6 border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <CalendarCheck size={24} />
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : booking.status === "Checked In"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status === "Checked Out"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <h2 className="text-xl font-bold mt-5">{booking.roomType} Room</h2>

            <p className="text-sm text-slate-500 mt-1">
              Room No: {booking.roomNumber}
            </p>

            {booking.requestedRoomNumber && (
              <p className="text-sm text-slate-500 mt-1">
                Requested Room: {booking.requestedRoomNumber}
              </p>
            )}

            <p className="text-sm text-slate-500 mt-1">
              Requested Date: {booking.date}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Payment: {booking.paymentStatus || "Pending"}
            </p>

            <p className="text-2xl font-bold mt-4">
              ₹
              {Number(booking.price || booking.amount || 0).toLocaleString(
                "en-IN"
              )}
            </p>

            <div className="flex gap-2 mt-5">
              {booking.status !== "Cancelled" &&
                booking.status !== "Confirmed" &&
                booking.status !== "Checked In" &&
                booking.paymentStatus !== "Paid" && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                )}

              <button
                onClick={() => deleteBooking(booking.id)}
                className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border text-slate-500">
            No bookings found. Go to Rooms and book your first room.
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerBookings;