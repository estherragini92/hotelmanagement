import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Receipt,
} from "lucide-react";

const defaultPayments = [
  {
    id: 1,
    invoiceNo: "INV-1001",
    guestName: "Arun Kumar",
    roomNumber: "204",
    amount: 9000,
    method: "UPI",
    status: "Paid",
    date: "2026-06-24",
  },
  {
    id: 2,
    invoiceNo: "INV-1002",
    guestName: "Priya Sharma",
    roomNumber: "501",
    amount: 17000,
    method: "Card",
    status: "Pending",
    date: "2026-07-02",
  },
];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNo: "",
    guestName: "",
    roomNumber: "",
    amount: "",
    method: "Cash",
    status: "Pending",
    date: "",
  });

  useEffect(() => {
    const savedPayments = JSON.parse(localStorage.getItem("hotelPayments"));

    if (savedPayments && savedPayments.length > 0) {
      setPayments(savedPayments);
    } else {
      setPayments(defaultPayments);
      localStorage.setItem("hotelPayments", JSON.stringify(defaultPayments));
    }
  }, []);

  const savePayments = (updatedPayments) => {
    setPayments(updatedPayments);
    localStorage.setItem("hotelPayments", JSON.stringify(updatedPayments));
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
      invoiceNo: `INV-${Date.now()}`,
      guestName: "",
      roomNumber: "",
      amount: "",
      method: "Cash",
      status: "Pending",
      date: "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.invoiceNo ||
      !formData.guestName ||
      !formData.roomNumber ||
      !formData.amount ||
      !formData.date
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedPayments = payments.map((payment) =>
        payment.id === editId
          ? {
              ...payment,
              ...formData,
              amount: Number(formData.amount),
            }
          : payment
      );

      savePayments(updatedPayments);
    } else {
      const newPayment = {
        id: Date.now(),
        ...formData,
        amount: Number(formData.amount),
      };

      savePayments([...payments, newPayment]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (payment) => {
    setEditId(payment.id);
    setFormData({
      invoiceNo: payment.invoiceNo,
      guestName: payment.guestName,
      roomNumber: payment.roomNumber,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      date: payment.date,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (confirmDelete) {
      const updatedPayments = payments.filter((payment) => payment.id !== id);
      savePayments(updatedPayments);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      payment.guestName.toLowerCase().includes(search.toLowerCase()) ||
      payment.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      payment.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const paidCount = payments.filter((payment) => payment.status === "Paid").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payments & Invoices
          </h1>
          <p className="text-slate-500 mt-1">
            Manage guest payments, invoices and pending dues.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Invoices</p>
          <h2 className="text-3xl font-bold mt-2">{payments.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Paid Invoices</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {paidCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Pending Amount</p>
          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-5">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search by invoice, guest, room or status..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Guest</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <Receipt size={18} />
                      {payment.invoiceNo}
                    </div>
                  </td>

                  <td className="py-4">{payment.guestName}</td>
                  <td className="py-4">{payment.roomNumber}</td>

                  <td className="py-4">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">{payment.method}</td>
                  <td className="py-4">{payment.date}</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    No payments found
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
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {editId ? "Edit Payment" : "Add Payment"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="invoiceNo"
                placeholder="Invoice Number"
                className="border rounded-xl px-4 py-3"
                value={formData.invoiceNo}
                onChange={handleChange}
              />

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
                type="number"
                name="amount"
                placeholder="Amount"
                className="border rounded-xl px-4 py-3"
                value={formData.amount}
                onChange={handleChange}
              />

              <select
                name="method"
                className="border rounded-xl px-4 py-3"
                value={formData.method}
                onChange={handleChange}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>

              <input
                type="date"
                name="date"
                className="border rounded-xl px-4 py-3"
                value={formData.date}
                onChange={handleChange}
              />

              <select
                name="status"
                className="border rounded-xl px-4 py-3 md:col-span-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Refunded</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl"
            >
              {editId ? "Update Payment" : "Save Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Payments;