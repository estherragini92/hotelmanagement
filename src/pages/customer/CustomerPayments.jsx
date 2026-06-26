import { useEffect, useState } from "react";
import { CreditCard, Receipt, X, ShieldCheck } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

function CustomerPayments() {
  const [bookings, setBookings] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

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

  const totalAmount = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce(
      (sum, booking) => sum + Number(booking.price || booking.amount || 0),
      0
    );

  const openPaymentForm = (booking) => {
    setSelectedBooking(booking);
    setCardData({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
    setShowPaymentForm(true);
  };

  const handleCardChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const approvePayment = (e) => {
    e.preventDefault();

    if (
      !cardData.cardName ||
      !cardData.cardNumber ||
      !cardData.expiry ||
      !cardData.cvv
    ) {
      alert("Please fill all card details");
      return;
    }

    if (cardData.cardNumber.replaceAll(" ", "").length !== 16) {
      alert("Card number must be 16 digits");
      return;
    }

    if (cardData.cvv.length !== 3) {
      alert("CVV must be 3 digits");
      return;
    }

    const bookingId = selectedBooking.id;

    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, paymentStatus: "Paid" }
        : booking
    );

    setBookings(updatedBookings);
    setCustomerData("hotelCustomerBookings", updatedBookings);

    const adminBookings =
      JSON.parse(localStorage.getItem("hotelBookings")) || [];

    const updatedAdminBookings = adminBookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, paymentStatus: "Paid" }
        : booking
    );

    localStorage.setItem(
      "hotelBookings",
      JSON.stringify(updatedAdminBookings)
    );

    const paidBooking = updatedBookings.find(
      (booking) => booking.id === bookingId
    );

    const adminPayments =
      JSON.parse(localStorage.getItem("hotelPayments")) || [];

    const alreadyPaid = adminPayments.some(
      (payment) => payment.bookingId === bookingId
    );

    if (!alreadyPaid && paidBooking) {
      const newPayment = {
        id: Date.now(),
        invoiceNo: `INV-${Date.now()}`,
        guestName: paidBooking.guestName || "Customer",
        customerEmail: paidBooking.customerEmail || "",
        roomNumber: paidBooking.roomNumber,
        amount: Number(paidBooking.price || paidBooking.amount || 0),
        method: "Card",
        cardLast4: cardData.cardNumber.slice(-4),
        status: "Paid",
        date: new Date().toISOString().split("T")[0],
        bookingId: bookingId,
        source: "Customer Portal",
      };

      localStorage.setItem(
        "hotelPayments",
        JSON.stringify([...adminPayments, newPayment])
      );
    }

    setShowPaymentForm(false);
    setSelectedBooking(null);

    notifyHotelUpdate(HOTEL_EVENTS.BOOKINGS, HOTEL_EVENTS.PAYMENTS);

    alert("Payment approved successfully. Admin payments updated.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Payments</h1>
        <p className="text-slate-500 mt-1">
          View your booking payments and invoices.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{bookings.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Amount</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{totalAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Payment Mode</p>
          <h2 className="text-3xl font-bold mt-2">Card</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="text-xl font-bold mb-5">Payment History</h2>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl bg-slate-50 border p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Receipt size={22} />
                </div>

                <div>
                  <h3 className="font-bold">
                    {booking.roomType} Room - {booking.roomNumber}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Booking Date: {booking.date}
                  </p>

                  <p className="text-sm text-slate-500">
                    Status: {booking.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <p className="text-xl font-bold">
                  ₹
                  {Number(
                    booking.price || booking.amount || 0
                  ).toLocaleString("en-IN")}
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs w-fit ${
                    booking.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.paymentStatus || "Pending"}
                </span>

                {booking.status === "Confirmed" &&
                  booking.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => openPaymentForm(booking)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <CreditCard size={16} />
                      Pay Now
                    </button>
                  )}

                {booking.status === "Pending" && (
                  <p className="text-sm text-amber-600">
                    Waiting for booking confirmation
                  </p>
                )}

                {booking.status === "Cancelled" && (
                  <p className="text-sm text-red-600">
                    Booking cancelled
                  </p>
                )}

                {booking.paymentStatus === "Paid" && (
                  <p className="text-sm text-green-600">
                    Payment completed
                  </p>
                )}
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <p className="text-slate-500">No payment records found.</p>
          )}
        </div>
      </div>

      {showPaymentForm && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <form
            onSubmit={approvePayment}
            className="bg-white rounded-2xl p-6 w-full max-w-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Card Payment
                </h2>
                <p className="text-sm text-slate-500">
                  Pay ₹
                  {Number(
                    selectedBooking.price || selectedBooking.amount || 0
                  ).toLocaleString("en-IN")}{" "}
                  for {selectedBooking.roomType}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
              >
                <X />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 text-white p-5 mb-5">
              <p className="text-sm text-slate-300">Credit / Debit Card</p>
              <h3 className="text-2xl font-bold mt-4 tracking-widest">
                {cardData.cardNumber || "0000 0000 0000 0000"}
              </h3>

              <div className="flex justify-between mt-5 text-sm">
                <p>{cardData.cardName || "CARD HOLDER"}</p>
                <p>{cardData.expiry || "MM/YY"}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                name="cardName"
                placeholder="Card Holder Name"
                className="border rounded-xl px-4 py-3"
                value={cardData.cardName}
                onChange={handleCardChange}
              />

              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                maxLength="16"
                className="border rounded-xl px-4 py-3"
                value={cardData.cardNumber}
                onChange={handleCardChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="border rounded-xl px-4 py-3"
                  value={cardData.expiry}
                  onChange={handleCardChange}
                />

                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="3"
                  className="border rounded-xl px-4 py-3"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              Approve Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerPayments;