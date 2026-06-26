import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  Search,
  Users,
  Ruler,
  ShoppingCart,
  Heart,
  ChevronRight,
} from "lucide-react";

import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";

import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    guests: 2,
    beds: 1,
    size: "250 sq.ft",
    price: 3500,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Premium Room",
    guests: 2,
    beds: 1,
    size: "350 sq.ft",
    price: 4500,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Executive Suite",
    guests: 3,
    beds: 1,
    size: "550 sq.ft",
    price: 6500,
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Presidential Suite",
    guests: 4,
    beds: 2,
    size: "850 sq.ft",
    price: 12000,
    tag: "Luxury",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  },
];

const foods = [
  {
    id: 1,
    name: "Hyderabadi Biryani",
    category: "Main Course",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Pasta Alfredo",
    category: "Main Course",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Classic Burger",
    category: "Snacks",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Grilled Chicken",
    category: "Main Course",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  },
];

function CustomerDashboard() {
  const navigate = useNavigate();

  const bookRoom = (room) => {
    const customerBookings = getCustomerData("hotelCustomerBookings");

    const adminBookings =
      JSON.parse(localStorage.getItem("hotelBookings")) || [];

    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

    const newBooking = {
      id: Date.now(),
      guestName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "",
      roomNumber: "Not Allocated",
      requestedRoomNumber: room.id,
      roomType: room.name,
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: "",
      guests: room.guests,
      status: "Pending",
      amount: Number(room.price),
      price: Number(room.price),
      paymentStatus: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
      source: "Customer Portal",
    };

    const updatedCustomerBookings = [...customerBookings, newBooking];
    const updatedAdminBookings = [...adminBookings, newBooking];

    setCustomerData("hotelCustomerBookings", updatedCustomerBookings);

    localStorage.setItem(
      "hotelBookings",
      JSON.stringify(updatedAdminBookings)
    );

    notifyHotelUpdate(HOTEL_EVENTS.BOOKINGS);

    alert("Room booking request sent to admin successfully");
  };

  const orderFood = (food) => {
    const customerOrders = getCustomerData("hotelCustomerFoodOrders");

    const adminOrders =
      JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];

    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

    const newOrder = {
      id: Date.now(),
      guestName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "",
      roomNumber: "Customer Room",
      item: food.name,
      category: food.category,
      quantity: 1,
      amount: Number(food.price),
      price: Number(food.price),
      status: "Ordered",
      date: new Date().toLocaleDateString("en-IN"),
      source: "Customer Portal",
    };

    const updatedCustomerOrders = [...customerOrders, newOrder];
    const updatedAdminOrders = [...adminOrders, newOrder];

    setCustomerData("hotelCustomerFoodOrders", updatedCustomerOrders);

    localStorage.setItem(
      "hotelFoodOrders",
      JSON.stringify(updatedAdminOrders)
    );

    notifyHotelUpdate(HOTEL_EVENTS.FOOD);

    alert("Food order sent to admin successfully");
  };

  return (
    <div className="space-y-7">
      <section
        className="relative overflow-hidden rounded-3xl min-h-[290px] bg-cover bg-center p-8 text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.95), rgba(2,6,23,0.65), rgba(2,6,23,0.15)), url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <h1 className="text-4xl font-bold leading-tight max-w-xl">
          Book Rooms. Order Food. Enjoy Your Stay.
        </h1>

        <p className="mt-4 text-slate-200 text-lg">
          Experience comfort and luxury like never before.
        </p>

        <div className="mt-7 bg-white text-slate-900 rounded-2xl shadow-xl p-4 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] max-w-4xl">
          <div className="px-3">
            <p className="text-sm text-slate-500 mb-2">Check-in</p>
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays size={18} />
              May 20, 2026
            </div>
          </div>

          <div className="px-3 md:border-l">
            <p className="text-sm text-slate-500 mb-2">Check-out</p>
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays size={18} />
              May 22, 2026
            </div>
          </div>

          <div className="px-3 md:border-l">
            <p className="text-sm text-slate-500 mb-2">Guests</p>
            <div className="flex items-center gap-2 font-semibold">
              <Users size={18} />2 Guests
            </div>
          </div>

          <button
            onClick={() => navigate("/customer/rooms")}
            className="bg-slate-950 text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center"
          >
            <Search size={18} />
            Search Rooms
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Our Rooms</h2>

          <button
            onClick={() => navigate("/customer/rooms")}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            View All Rooms
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="relative h-48">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover"
                />

                {room.tag && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {room.tag}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {room.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <Users size={15} />
                    {room.guests} Guests
                  </span>

                  <span className="flex items-center gap-1">
                    <BedDouble size={15} />
                    {room.beds} Bed
                  </span>

                  <span className="flex items-center gap-1">
                    <Ruler size={15} />
                    {room.size}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <p className="text-2xl font-bold">
                    ₹{room.price.toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / night
                    </span>
                  </p>

                  <button
                    onClick={() => navigate("/customer/rooms")}
                    className="bg-slate-950 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition">
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Popular Food</h2>

          <button
            onClick={() => navigate("/customer/food")}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            View All Food
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="relative h-40">
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-full w-full object-cover"
                />

                <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center">
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900">{food.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {food.category}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold">₹{food.price}</p>

                  <button
                    onClick={() => orderFood(food)}
                    className="bg-slate-950 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <ShoppingCart size={15} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;