import { useEffect, useState } from "react";
import { BedDouble, Search, Star, Users, Ruler } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

const roomImages = {
  Standard:
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
  Deluxe:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  Suite:
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
  Family:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
  Executive:
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
};

const fallbackRooms = [
  {
    id: 1,
    roomNumber: "101",
    type: "Standard",
    price: 2500,
    capacity: 2,
    status: "Available",
  },
  {
    id: 2,
    roomNumber: "204",
    type: "Deluxe",
    price: 4500,
    capacity: 3,
    status: "Available",
  },
  {
    id: 3,
    roomNumber: "501",
    type: "Suite",
    price: 8500,
    capacity: 4,
    status: "Available",
  },
];

function CustomerRooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadRooms = () => {
      const savedRooms = JSON.parse(localStorage.getItem("hotelRooms"));
      setRooms(savedRooms && savedRooms.length > 0 ? savedRooms : fallbackRooms);
    };

    loadRooms();

    window.addEventListener("storage", loadRooms);
    window.addEventListener("hotelRoomUpdate", loadRooms);

    return () => {
      window.removeEventListener("storage", loadRooms);
      window.removeEventListener("hotelRoomUpdate", loadRooms);
    };
  }, []);

  const availableRooms = rooms.filter(
    (room) => room.status === "Available" || room.status === "Vacant"
  );

  const filteredRooms = availableRooms.filter(
    (room) =>
      String(room.roomNumber).toLowerCase().includes(search.toLowerCase()) ||
      String(room.type).toLowerCase().includes(search.toLowerCase())
  );

 const handleBookRoom = (room) => {
  const customerBookings = getCustomerData("hotelCustomerBookings");

  const adminBookings =
    JSON.parse(localStorage.getItem("hotelBookings")) || [];

  const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

  const newBooking = {
    id: Date.now(),
    guestName: currentUser?.name || "Customer",
    customerEmail: currentUser?.email || "",
    roomNumber: room.roomNumber,
    roomType: room.type,
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: "",
    guests: room.capacity,
    status: "Confirmed",
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

  const hotelRooms =
    JSON.parse(localStorage.getItem("hotelRooms")) || [];

  const updatedRooms = hotelRooms.map((item) =>
    item.roomNumber === room.roomNumber
      ? { ...item, status: "Occupied" }
      : item
  );

  localStorage.setItem("hotelRooms", JSON.stringify(updatedRooms));

  notifyHotelUpdate(HOTEL_EVENTS.BOOKINGS, HOTEL_EVENTS.ROOMS);

  alert("Room booked successfully. You can now make payment.");
};

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl p-8 text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.95), rgba(2,6,23,0.45)), url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <h1 className="text-4xl font-bold">Find Your Perfect Room</h1>
        <p className="text-slate-200 mt-3">
          Browse luxury rooms and book your stay easily.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-6">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search rooms by number or type..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl border bg-white overflow-hidden shadow-sm"
            >
              <div className="relative h-56">
                <img
                  src={roomImages[room.type] || roomImages.Standard}
                  alt={room.type}
                  className="h-full w-full object-cover"
                />

                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Available
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{room.type} Room</h3>
                    <p className="text-sm text-slate-500">
                      Room No: {room.roomNumber}
                    </p>
                  </div>

                  <p className="flex items-center gap-1 text-amber-600 text-sm">
                    <Star size={15} fill="currentColor" />
                    4.8
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mt-5">
                  <p className="flex items-center gap-2">
                    <Users size={16} />
                    {room.capacity} Guests
                  </p>

                  <p className="flex items-center gap-2">
                    <BedDouble size={16} />1 Bed
                  </p>

                  <p className="flex items-center gap-2">
                    <Ruler size={16} />
                    350 sq.ft
                  </p>
                </div>

                <p className="text-2xl font-bold mt-5">
                  ₹{Number(room.price).toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-slate-500">
                    {" "}
                    / night
                  </span>
                </p>

                <button
                  onClick={() => handleBookRoom(room)}
                  className="mt-5 w-full bg-slate-950 text-white py-3 rounded-xl"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {filteredRooms.length === 0 && (
            <p className="text-slate-500">No available rooms found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerRooms;