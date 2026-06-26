import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
} from "lucide-react";

const defaultGuests = [
  {
    id: 1,
    name: "Arun Kumar",
    email: "arun@gmail.com",
    phone: "9876543210",
    address: "Chennai",
    idProof: "Aadhaar",
    roomNumber: "204",
    status: "Checked In",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "9876501234",
    address: "Bangalore",
    idProof: "Passport",
    roomNumber: "501",
    status: "Reserved",
  },
];

function Guests() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idProof: "Aadhaar",
    roomNumber: "",
    status: "Reserved",
  });

  useEffect(() => {
    const savedGuests = JSON.parse(localStorage.getItem("hotelGuests"));

    if (savedGuests && savedGuests.length > 0) {
      setGuests(savedGuests);
    } else {
      setGuests(defaultGuests);
      localStorage.setItem("hotelGuests", JSON.stringify(defaultGuests));
    }
  }, []);

  const saveGuests = (updatedGuests) => {
    setGuests(updatedGuests);
    localStorage.setItem("hotelGuests", JSON.stringify(updatedGuests));
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
      name: "",
      email: "",
      phone: "",
      address: "",
      idProof: "Aadhaar",
      roomNumber: "",
      status: "Reserved",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.roomNumber
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedGuests = guests.map((guest) =>
        guest.id === editId ? { ...guest, ...formData } : guest
      );

      saveGuests(updatedGuests);
    } else {
      const newGuest = {
        id: Date.now(),
        ...formData,
      };

      saveGuests([...guests, newGuest]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (guest) => {
    setEditId(guest.id);
    setFormData(guest);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this guest?"
    );

    if (confirmDelete) {
      const updatedGuests = guests.filter((guest) => guest.id !== id);
      saveGuests(updatedGuests);
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(search.toLowerCase()) ||
      guest.email.toLowerCase().includes(search.toLowerCase()) ||
      guest.phone.toLowerCase().includes(search.toLowerCase()) ||
      guest.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const checkedInGuests = guests.filter(
    (guest) => guest.status === "Checked In"
  ).length;

  const reservedGuests = guests.filter(
    (guest) => guest.status === "Reserved"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Guests Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage guest information, room details and ID proof.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Guest
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Guests</p>
          <h2 className="text-3xl font-bold mt-2">{guests.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Checked In</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {checkedInGuests}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Reserved</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {reservedGuests}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search guest by name, email, phone or room..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="rounded-2xl border bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Users size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{guest.name}</h3>
                    <p className="text-sm text-slate-500">
                      Room {guest.roomNumber}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    guest.status === "Checked In"
                      ? "bg-green-100 text-green-700"
                      : guest.status === "Reserved"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {guest.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {guest.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {guest.phone}
                </p>

                <p>Address: {guest.address}</p>
                <p>ID Proof: {guest.idProof}</p>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleEdit(guest)}
                  className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(guest.id)}
                  className="flex-1 py-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredGuests.length === 0 && (
            <p className="text-slate-500">No guests found</p>
          )}
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
                {editId ? "Edit Guest" : "Add Guest"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Guest Name"
                className="border rounded-xl px-4 py-3"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border rounded-xl px-4 py-3"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="border rounded-xl px-4 py-3"
                value={formData.phone}
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

              <select
                name="idProof"
                className="border rounded-xl px-4 py-3"
                value={formData.idProof}
                onChange={handleChange}
              >
                <option>Aadhaar</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>Voter ID</option>
              </select>

              <select
                name="status"
                className="border rounded-xl px-4 py-3"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Reserved</option>
                <option>Checked In</option>
                <option>Checked Out</option>
              </select>

              <textarea
                name="address"
                placeholder="Address"
                className="border rounded-xl px-4 py-3 md:col-span-2"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Guest" : "Save Guest"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Guests;