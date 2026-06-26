import { useEffect, useState } from "react";
import { Bell, Search, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getReadNotifications = () => {
    return JSON.parse(localStorage.getItem("hotelAdminReadNotifications")) || [];
  };

  const saveReadNotifications = (ids) => {
    localStorage.setItem("hotelAdminReadNotifications", JSON.stringify(ids));
  };

  const loadNotifications = () => {
    const readIds = getReadNotifications();

    const bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];
    const foodOrders = JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];
    const requests =
      JSON.parse(localStorage.getItem("hotelCustomerRequests")) || [];
    const payments = JSON.parse(localStorage.getItem("hotelPayments")) || [];
    const invoices = JSON.parse(localStorage.getItem("hotelInvoices")) || [];

    const bookingNotes = bookings
      .filter((item) => item.source === "Customer Portal")
      .map((item) => ({
        id: `booking-${item.id}`,
        rawId: item.id,
        title: "🏨 Room Booking",
        message: `${item.guestName} booked ${item.roomType || "a room"}`,
        page: "/admin/bookings",
        time: item.date || "Recently",
      }));

    const foodNotes = foodOrders
      .filter((item) => item.source === "Customer Portal")
      .map((item) => ({
        id: `food-${item.id}`,
        rawId: item.id,
        title: "🍽️ Food Order",
        message: `${item.guestName} ordered ${item.item}`,
        page: "/admin/restaurant",
        time: item.date || "Recently",
      }));

    const requestNotes = requests.map((item) => ({
      id: `request-${item.id}`,
      rawId: item.id,
      title: "🛎️ Customer Request",
      message: `${item.guestName}: ${item.message}`,
      page: "/admin/customer-requests",
      time: item.date || "Recently",
    }));

    const paymentNotes = payments
      .filter((item) => item.source?.includes("Customer"))
      .map((item) => ({
        id: `payment-${item.id}`,
        rawId: item.id,
        title: "💳 Payment Received",
        message: `${item.guestName} paid ₹${Number(
          item.amount || 0
        ).toLocaleString("en-IN")}`,
        page: "/admin/payments",
        time: item.date || "Recently",
      }));

    const invoiceNotes = invoices.map((item) => ({
      id: `invoice-${item.id}`,
      rawId: item.id,
      title: "🧾 Invoice Generated",
      message: `${item.invoiceNo} generated for ${item.guestName}`,
      page: "/admin/invoices",
      time: item.date || "Recently",
    }));

    const latestNotifications = [
      ...bookingNotes,
      ...foodNotes,
      ...requestNotes,
      ...paymentNotes,
      ...invoiceNotes,
    ]
      .sort((a, b) => Number(b.rawId) - Number(a.rawId))
      .slice(0, 10)
      .map((item) => ({
        ...item,
        isRead: readIds.includes(item.id),
      }));

    setNotifications(latestNotifications);
  };

  useEffect(() => {
    loadNotifications();

    window.addEventListener("hotelBookingUpdate", loadNotifications);
    window.addEventListener("hotelFoodUpdate", loadNotifications);
    window.addEventListener("hotelRequestUpdate", loadNotifications);
    window.addEventListener("hotelPaymentUpdate", loadNotifications);
    window.addEventListener("hotelInvoiceUpdate", loadNotifications);
    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("hotelBookingUpdate", loadNotifications);
      window.removeEventListener("hotelFoodUpdate", loadNotifications);
      window.removeEventListener("hotelRequestUpdate", loadNotifications);
      window.removeEventListener("hotelPaymentUpdate", loadNotifications);
      window.removeEventListener("hotelInvoiceUpdate", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const markAsRead = (notificationId) => {
    const readIds = getReadNotifications();

    if (!readIds.includes(notificationId)) {
      saveReadNotifications([...readIds, notificationId]);
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
  };

  const openNotification = (item) => {
    markAsRead(item.id);
    setShowNotifications(false);
    navigate(item.page);
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((item) => item.id);
    const readIds = getReadNotifications();
    const mergedIds = Array.from(new Set([...readIds, ...allIds]));

    saveReadNotifications(mergedIds);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Hotel Management
          </h2>
          <p className="text-sm text-slate-500">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 w-[360px]">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search rooms, guests, bookings..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-20 top-14 w-96 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div>
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500">
                    {unreadCount} unread updates
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}

                  <button onClick={() => setShowNotifications(false)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openNotification(item)}
                      className={`w-full text-left px-5 py-4 border-b hover:bg-slate-50 ${
                        item.isRead ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4
                            className={`text-slate-900 ${
                              item.isRead ? "font-semibold" : "font-bold"
                            }`}
                          >
                            {item.title}
                          </h4>

                          <p className="text-sm text-slate-600 mt-1">
                            {item.message}
                          </p>

                          <p className="text-xs text-slate-400 mt-2">
                            {item.time}
                          </p>
                        </div>

                        {!item.isRead && (
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-2"></span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-5 text-sm text-slate-500">
                    No notifications
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="h-11 px-4 rounded-xl bg-slate-950 text-white flex items-center gap-2 text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;