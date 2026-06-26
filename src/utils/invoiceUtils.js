export const generateInvoiceForBooking = (booking) => {
  const invoices = JSON.parse(localStorage.getItem("hotelInvoices")) || [];

  const alreadyExists = invoices.find(
    (invoice) => invoice.bookingId === booking.id
  );

  if (alreadyExists) {
    return alreadyExists;
  }

  const foodOrders = JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];

  const customerFoodOrders = foodOrders.filter(
    (order) => order.customerEmail === booking.customerEmail
  );

  const foodTotal = customerFoodOrders.reduce(
    (sum, order) => sum + Number(order.amount || order.price || 0),
    0
  );

  const roomTotal = Number(booking.amount || booking.price || 0);
  const subtotal = roomTotal + foodTotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const newInvoice = {
    id: Date.now(),
    invoiceNo: `INV-${Date.now()}`,
    bookingId: booking.id,
    guestName: booking.guestName,
    customerEmail: booking.customerEmail || "",
    roomNumber: booking.roomNumber,
    roomType: booking.roomType,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomTotal,
    foodTotal,
    gst,
    total,
    paymentStatus: booking.paymentStatus || "Pending",
    bookingStatus: booking.status,
    date: new Date().toISOString().split("T")[0],
    source: "Auto Generated",
  };

  localStorage.setItem(
    "hotelInvoices",
    JSON.stringify([...invoices, newInvoice])
  );

  window.dispatchEvent(new Event("hotelInvoiceUpdate"));

  return newInvoice;
};