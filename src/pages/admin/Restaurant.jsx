import { useEffect, useState } from "react";
import {
  Utensils,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const defaultOrders = [
  {
    id: 1,
    guestName: "Arun Kumar",
    roomNumber: "204",
    item: "Chicken Biryani",
    category: "Main Course",
    quantity: 2,
    amount: 700,
    price: 350,
    status: "Preparing",
    date: "24/06/2026",
    source: "Admin",
  },
  {
    id: 2,
    guestName: "Priya Sharma",
    roomNumber: "501",
    item: "Paneer Butter Masala",
    category: "Main Course",
    quantity: 1,
    amount: 350,
    price: 350,
    status: "Delivered",
    date: "24/06/2026",
    source: "Admin",
  },
];

function Restaurant() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    item: "",
    category: "Main Course",
    quantity: "",
    amount: "",
    status: "Ordered",
  });

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("hotelFoodOrders"));

      if (savedOrders && savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        setOrders(defaultOrders);
        localStorage.setItem("hotelFoodOrders", JSON.stringify(defaultOrders));
      }
    };

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener("hotelFoodUpdate", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("hotelFoodUpdate", loadOrders);
    };
  }, []);

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem("hotelFoodOrders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("hotelFoodUpdate"));
  };

  const syncCustomerOrder = (updatedOrder) => {
    const customerOrders =
      JSON.parse(localStorage.getItem("hotelCustomerFoodOrders")) || [];

    const updatedCustomerOrders = customerOrders.map((order) =>
      order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
    );

    localStorage.setItem(
      "hotelCustomerFoodOrders",
      JSON.stringify(updatedCustomerOrders)
    );
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
      guestName: "",
      roomNumber: "",
      item: "",
      category: "Main Course",
      quantity: "",
      amount: "",
      status: "Ordered",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.guestName ||
      !formData.roomNumber ||
      !formData.item ||
      !formData.quantity ||
      !formData.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      let updatedOrderData = null;

      const updatedOrders = orders.map((order) => {
        if (order.id === editId) {
          updatedOrderData = {
            ...order,
            ...formData,
            quantity: Number(formData.quantity),
            amount: Number(formData.amount),
            price: Number(formData.amount) / Number(formData.quantity),
          };

          return updatedOrderData;
        }

        return order;
      });

      saveOrders(updatedOrders);

      if (updatedOrderData) {
        syncCustomerOrder(updatedOrderData);
      }
    } else {
      const newOrder = {
        id: Date.now(),
        ...formData,
        quantity: Number(formData.quantity),
        amount: Number(formData.amount),
        price: Number(formData.amount) / Number(formData.quantity),
        date: new Date().toLocaleDateString("en-IN"),
        source: "Admin",
      };

      saveOrders([...orders, newOrder]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (order) => {
    setEditId(order.id);

    setFormData({
      guestName: order.guestName || "",
      roomNumber: order.roomNumber || "",
      item: order.item || "",
      category: order.category || "Main Course",
      quantity: order.quantity || "",
      amount: order.amount || order.price || "",
      status: order.status || "Ordered",
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (confirmDelete) {
      const updatedOrders = orders.filter((order) => order.id !== id);
      saveOrders(updatedOrders);

      const customerOrders =
        JSON.parse(localStorage.getItem("hotelCustomerFoodOrders")) || [];

      const updatedCustomerOrders = customerOrders.filter(
        (order) => order.id !== id
      );

      localStorage.setItem(
        "hotelCustomerFoodOrders",
        JSON.stringify(updatedCustomerOrders)
      );
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      String(order.guestName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(order.roomNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(order.item || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(order.status || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.amount || order.price || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const customerPortalOrders = orders.filter(
    (order) => order.source === "Customer Portal"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Restaurant Orders
          </h1>
          <p className="text-slate-500 mt-1">
            Manage food orders from admin and customer portal.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Order
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Delivered</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {deliveredOrders}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Customer Orders</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {customerPortalOrders}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Food Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by guest, room, food or status..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border bg-slate-50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Utensils size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{order.item}</h3>
                    <p className="text-sm text-slate-500">
                      Room {order.roomNumber}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Preparing"
                      ? "bg-amber-100 text-amber-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>Guest: {order.guestName}</p>
                <p>Category: {order.category || "Food"}</p>
                <p>Quantity: {order.quantity}</p>
                <p>
                  Amount: ₹
                  {Number(order.amount || order.price || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>
                <p>Date: {order.date || "Not Added"}</p>

                <p>
                  Source:{" "}
                  <span
                    className={`font-semibold ${
                      order.source === "Customer Portal"
                        ? "text-blue-600"
                        : "text-slate-700"
                    }`}
                  >
                    {order.source || "Admin"}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleEdit(order)}
                  className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex-1 py-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <p className="text-slate-500">No orders found</p>
          )}
        </div>
      </div>

      {preparingOrders > 0 && (
        <div className="rounded-2xl bg-amber-100 text-amber-800 p-5">
          {preparingOrders} food order(s) are currently preparing.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editId ? "Edit Order" : "Add Order"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="guestName"
                placeholder="Guest Name"
                className="border rounded-xl px-4 py-3"
                value={formData.guestName}
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

              <input
                type="text"
                name="item"
                placeholder="Food Item"
                className="border rounded-xl px-4 py-3"
                value={formData.item}
                onChange={handleChange}
              />

              <select
                name="category"
                className="border rounded-xl px-4 py-3"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Main Course</option>
                <option>Breakfast</option>
                <option>Snacks</option>
                <option>Dessert</option>
                <option>Drinks</option>
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                className="border rounded-xl px-4 py-3"
                value={formData.quantity}
                onChange={handleChange}
              />

              <input
                type="number"
                name="amount"
                placeholder="Total Amount"
                className="border rounded-xl px-4 py-3"
                value={formData.amount}
                onChange={handleChange}
              />

              <select
                name="status"
                className="border rounded-xl px-4 py-3 md:col-span-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Ordered</option>
                <option>Preparing</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Order" : "Save Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Restaurant;