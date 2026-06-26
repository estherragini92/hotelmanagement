import { useEffect, useState } from "react";
import {
  BedDouble,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const defaultRooms = [
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
    status: "Occupied",
  },
  {
    id: 3,
    roomNumber: "501",
    type: "Suite",
    price: 8500,
    capacity: 4,
    status: "Cleaning",
  },
];

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Standard",
    price: "",
    capacity: "",
    status: "Available",
  });

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("hotelRooms"));

    if (savedRooms && savedRooms.length > 0) {
      setRooms(savedRooms);
    } else {
      setRooms(defaultRooms);
      localStorage.setItem("hotelRooms", JSON.stringify(defaultRooms));
    }
  }, []);

  const saveRooms = (updatedRooms) => {
    setRooms(updatedRooms);
    localStorage.setItem("hotelRooms", JSON.stringify(updatedRooms));
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
      roomNumber: "",
      type: "Standard",
      price: "",
      capacity: "",
      status: "Available",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.roomNumber ||
      !formData.price ||
      !formData.capacity
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedRooms = rooms.map((room) =>
        room.id === editId
          ? {
              ...room,
              ...formData,
              price: Number(formData.price),
              capacity: Number(formData.capacity),
            }
          : room
      );

      saveRooms(updatedRooms);
    } else {
      const newRoom = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
      };

      saveRooms([...rooms, newRoom]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (room) => {
    setEditId(room.id);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      status: room.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (confirmDelete) {
      const updatedRooms = rooms.filter((room) => room.id !== id);
      saveRooms(updatedRooms);
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;
  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;
  const cleaningRooms = rooms.filter(
    (room) => room.status === "Cleaning"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Rooms Management
          </h1>
          <p className="text-slate-500 mt-1">
            Add, update and manage hotel rooms.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Room
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Rooms</p>
          <h2 className="text-3xl font-bold mt-2">{totalRooms}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Available</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {availableRooms}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Occupied</p>
          <h2 className="text-3xl font-bold mt-2 text-red-600">
            {occupiedRooms}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Cleaning</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {cleaningRooms}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by room number, type or status..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-3">Room No</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Capacity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} />
                      {room.roomNumber}
                    </div>
                  </td>

                  <td className="py-4">{room.type}</td>

                  <td className="py-4">
                    ₹{Number(room.price).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">{room.capacity} Guests</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        room.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : room.status === "Occupied"
                          ? "bg-red-100 text-red-700"
                          : room.status === "Cleaning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>

                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(room.id)}
                        className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRooms.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-slate-500"
                  >
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editId ? "Edit Room" : "Add Room"}
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                className="border rounded-xl px-4 py-3"
                value={formData.roomNumber}
                onChange={handleChange}
              />

              <select
                name="type"
                className="border rounded-xl px-4 py-3"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
                <option>Family</option>
                <option>Executive</option>
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price Per Night"
                className="border rounded-xl px-4 py-3"
                value={formData.price}
                onChange={handleChange}
              />

              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                className="border rounded-xl px-4 py-3"
                value={formData.capacity}
                onChange={handleChange}
              />

              <select
                name="status"
                className="border rounded-xl px-4 py-3 md:col-span-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Available</option>
                <option>Occupied</option>
                <option>Cleaning</option>
                <option>Maintenance</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Room" : "Save Room"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Rooms;