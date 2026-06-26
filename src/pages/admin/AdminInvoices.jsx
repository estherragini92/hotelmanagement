import { useEffect, useState } from "react";
import { Receipt, Printer, Search } from "lucide-react";

function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  const loadInvoices = () => {
    const savedInvoices = JSON.parse(localStorage.getItem("hotelInvoices")) || [];
    setInvoices(savedInvoices);
  };

  useEffect(() => {
    loadInvoices();

    window.addEventListener("storage", loadInvoices);
    window.addEventListener("hotelInvoiceUpdate", loadInvoices);

    return () => {
      window.removeEventListener("storage", loadInvoices);
      window.removeEventListener("hotelInvoiceUpdate", loadInvoices);
    };
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      String(invoice.invoiceNo || "").toLowerCase().includes(search.toLowerCase()) ||
      String(invoice.guestName || "").toLowerCase().includes(search.toLowerCase()) ||
      String(invoice.roomNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      String(invoice.paymentStatus || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.paymentStatus === "Paid"
  ).length;

  const printInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>${invoice.invoiceNo}</title>
          <style>
            body { font-family: Arial; padding: 30px; background:#f8fafc; }
            .invoice { max-width: 760px; margin: auto; background:white; border: 1px solid #ddd; padding: 30px; }
            h1 { text-align: center; margin-bottom: 5px; }
            .sub { text-align:center; color:#555; margin-bottom:20px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-size: 22px; font-weight: bold; border-top: 2px solid #000; padding-top: 15px; }
            hr { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <h1>LuxuryStay Hotel</h1>
            <p class="sub">Official Hotel Invoice</p>
            <hr />

            <div class="row"><b>Invoice No:</b><span>${invoice.invoiceNo}</span></div>
            <div class="row"><b>Customer:</b><span>${invoice.guestName}</span></div>
            <div class="row"><b>Email:</b><span>${invoice.customerEmail || "N/A"}</span></div>
            <div class="row"><b>Room:</b><span>${invoice.roomType} - ${invoice.roomNumber}</span></div>
            <div class="row"><b>Check In:</b><span>${invoice.checkIn}</span></div>
            <div class="row"><b>Check Out:</b><span>${invoice.checkOut}</span></div>

            <hr />

            <div class="row"><span>Room Charges</span><span>₹${invoice.roomTotal}</span></div>
            <div class="row"><span>Food Charges</span><span>₹${invoice.foodTotal}</span></div>
            <div class="row"><span>GST 18%</span><span>₹${invoice.gst}</span></div>

            <div class="row total"><span>Total</span><span>₹${invoice.total}</span></div>

            <hr />

            <p><b>Payment Status:</b> ${invoice.paymentStatus}</p>
            <p><b>Booking Status:</b> ${invoice.bookingStatus}</p>
            <p><b>Date:</b> ${invoice.date}</p>
          </div>

          <script>window.print();</script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Invoice Management
        </h1>
        <p className="text-slate-500 mt-1">
          View, search and print generated hotel invoices.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Invoices</p>
          <h2 className="text-3xl font-bold mt-2">{invoices.length}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Paid Invoices</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {paidInvoices}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Invoice Revenue</p>
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
            placeholder="Search invoice, customer, room or payment..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Room Charges</th>
                <th className="pb-3">Food</th>
                <th className="pb-3">GST</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <Receipt size={18} />
                      {invoice.invoiceNo}
                    </div>
                  </td>

                  <td className="py-4">
                    <p className="font-medium">{invoice.guestName}</p>
                    <p className="text-xs text-slate-500">
                      {invoice.customerEmail || "No Email"}
                    </p>
                  </td>

                  <td className="py-4">
                    {invoice.roomType} - {invoice.roomNumber}
                  </td>

                  <td className="py-4">
                    ₹{Number(invoice.roomTotal || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">
                    ₹{Number(invoice.foodTotal || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">
                    ₹{Number(invoice.gst || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4 font-bold">
                    ₹{Number(invoice.total || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        invoice.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4">
                    <button
                      onClick={() => printInvoice(invoice)}
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-2 text-xs"
                    >
                      <Printer size={15} />
                      Print
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminInvoices;