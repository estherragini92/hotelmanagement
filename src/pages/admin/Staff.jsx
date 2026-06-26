import { useEffect, useState } from "react";
import {
  UserCog,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
} from "lucide-react";

const defaultStaff = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi@hotel.com",
    phone: "9876543210",
    role: "Housekeeping",
    shift: "Morning",
    salary: 18000,
    status: "Active",
  },
  {
    id: 2,
    name: "Meena Devi",
    email: "meena@hotel.com",
    phone: "9876501234",
    role: "Receptionist",
    shift: "Evening",
    salary: 22000,
    status: "Active",
  },
];

function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Receptionist",
    shift: "Morning",
    salary: "",
    status: "Active",
  });

  useEffect(() => {
    const savedStaff = JSON.parse(localStorage.getItem("hotelStaff"));

    if (savedStaff && savedStaff.length > 0) {
      setStaff(savedStaff);
    } else {
      setStaff(defaultStaff);
      localStorage.setItem("hotelStaff", JSON.stringify(defaultStaff));
    }
  }, []);

  const saveStaff = (updatedStaff) => {
    setStaff(updatedStaff);
    localStorage.setItem("hotelStaff", JSON.stringify(updatedStaff));
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
      role: "Receptionist",
      shift: "Morning",
      salary: "",
      status: "Active",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.salary
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedStaff = staff.map((item) =>
        item.id === editId
          ? { ...item, ...formData, salary: Number(formData.salary) }
          : item
      );

      saveStaff(updatedStaff);
    } else {
      const newStaff = {
        id: Date.now(),
        ...formData,
        salary: Number(formData.salary),
      };

      saveStaff([...staff, newStaff]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (confirmDelete) {
      const updatedStaff = staff.filter((item) => item.id !== id);
      saveStaff(updatedStaff);
    }
  };

  const filteredStaff = staff.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase()) ||
      item.shift.toLowerCase().includes(search.toLowerCase())
  );

  const activeStaff = staff.filter((item) => item.status === "Active").length;

  const totalSalary = staff.reduce(
    (sum, item) => sum + Number(item.salary || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Staff Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage hotel employees, roles, shifts and salary details.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Staff</p>
          <h2 className="text-3xl font-bold mt-2">{staff.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Active Staff</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {activeStaff}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Monthly Salary</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{totalSalary.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by name, email, role or shift..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-slate-50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <UserCog size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {item.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {item.phone}
                </p>

                <p>Shift: {item.shift}</p>
                <p>Salary: ₹{Number(item.salary).toLocaleString("en-IN")}</p>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <p className="text-slate-500">No staff found</p>
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
                {editId ? "Edit Staff" : "Add Staff"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Staff Name"
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
                type="number"
                name="salary"
                placeholder="Salary"
                className="border rounded-xl px-4 py-3"
                value={formData.salary}
                onChange={handleChange}
              />

              <select
                name="role"
                className="border rounded-xl px-4 py-3"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Receptionist</option>
                <option>Housekeeping</option>
                <option>Manager</option>
                <option>Chef</option>
                <option>Security</option>
                <option>Waiter</option>
              </select>

              <select
                name="shift"
                className="border rounded-xl px-4 py-3"
                value={formData.shift}
                onChange={handleChange}
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>

              <select
                name="status"
                className="border rounded-xl px-4 py-3 md:col-span-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Staff" : "Save Staff"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Staff;