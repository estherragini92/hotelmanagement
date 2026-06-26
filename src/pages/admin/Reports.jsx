import {
  BarChart3,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Users,
  Utensils,
} from "lucide-react";

function Reports() {
  const rooms = JSON.parse(localStorage.getItem("hotelRooms")) || [];
  const bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];
  const guests = JSON.parse(localStorage.getItem("hotelGuests")) || [];
  const payments = JSON.parse(localStorage.getItem("hotelPayments")) || [];
  const foodOrders = JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];

  const roomRevenue = bookings.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const paidRevenue = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const foodRevenue = foodOrders.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const cards = [
    {
      title: "Total Rooms",
      value: rooms.length,
      icon: BedDouble,
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarCheck,
    },
    {
      title: "Total Guests",
      value: guests.length,
      icon: Users,
    },
    {
      title: "Paid Revenue",
      value: `₹${paidRevenue.toLocaleString("en-IN")}`,
      icon: CreditCard,
    },
    {
      title: "Booking Revenue",
      value: `₹${roomRevenue.toLocaleString("en-IN")}`,
      icon: BarChart3,
    },
    {
      title: "Food Revenue",
      value: `₹${foodRevenue.toLocaleString("en-IN")}`,
      icon: Utensils,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Reports & Analytics
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of hotel performance, bookings, revenue and services.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                </div>

                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-5">Booking Status</h2>

          <div className="space-y-4">
            {["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"].map(
              (status) => {
                const count = bookings.filter(
                  (item) => item.status === status
                ).length;

                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{status}</span>
                      <span>{count}</span>
                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full"
                        style={{
                          width:
                            bookings.length > 0
                              ? `${(count / bookings.length) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-5">Room Status</h2>

          <div className="space-y-4">
            {["Available", "Occupied", "Cleaning", "Maintenance"].map(
              (status) => {
                const count = rooms.filter((item) => item.status === status).length;

                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{status}</span>
                      <span>{count}</span>
                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width:
                            rooms.length > 0
                              ? `${(count / rooms.length) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;