import { useEffect, useState } from "react";
import { Receipt, Printer, Search } from "lucide-react";

function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  const loadInvoices = () => {
    const user = JSON.parse(localStorage.getItem("hotelUser"));
    const allInvoices = JSON.parse(localStorage.getItem("hotelInvoices")) || [];

    const myInvoices = allInvoices.filter(
      (invoice) => invoice.customerEmail === user?.email
    );

    setInvoices(myInvoices);
  };

  useEffect(() => {
    loadInvoices();

    window.addEventListener("hotelInvoiceUpdate", loadInvoices);
    window.addEventListener("storage", loadInvoices);

    return () => {
      window.removeEventListener("hotelInvoiceUpdate", loadInvoices);
      window.removeEventListener("storage", loadInvoices);
    };
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      String(invoice.invoiceNo || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(invoice.roomNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(invoice.roomType || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(invoice.paymentStatus || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const printInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>${invoice.invoiceNo}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f8fafc;
              padding: 30px;
            }

            .invoice {
              max-width: 760px;
              margin: auto;
              background: white;
              border: 1px solid #ddd;
              padding: 30px;
            }

            h1 {
              text-align: center;
              margin-bottom: 5px;
            }

            .sub {
              text-align: center;
              color: #555;
              margin-bottom: 20px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
            }

            .total {
              font-size: 22px;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 15px;
            }

            hr {
              margin: 20px 0;
            }
          </style>
        </head>

        <body>
          <div class="invoice">
            <h1>LuxuryStay Hotel</h1>
            <p class="sub">Official Hotel Invoice</p>

            <hr />

            <div class="row">
              <b>Invoice No:</b>
              <span>${invoice.invoiceNo}</span>
            </div>

            <div class="row">
              <b>Customer:</b>
              <span>${invoice.guestName}</span>
            </div>

            <div class="row">
              <b>Email:</b>
              <span>${invoice.customerEmail || "N/A"}</span>
            </div>

            <div class="row">
              <b>Room:</b>
              <span>${invoice.roomType} - ${invoice.roomNumber}</span>
            </div>

            <div class="row">
              <b>Check In:</b>
              <span>${invoice.checkIn || "N/A"}</span>
            </div>

            <div class="row">
              <b>Check Out:</b>
              <span>${invoice.checkOut || "N/A"}</span>
            </div>

            <hr />

            <div class="row">
              <span>Room Charges</span>
              <span>₹${Number(invoice.roomTotal || 0).toLocaleString("en-IN")}</span>
            </div>

            <div class="row">
              <span>Food Charges</span>
              <span>₹${Number(invoice.foodTotal || 0).toLocaleString("en-IN")}</span>
            </div>

            <div class="row">
              <span>GST 18%</span>
              <span>₹${Number(invoice.gst || 0).toLocaleString("en-IN")}</span>
            </div>

            <div class="row total">
              <span>Total</span>
              <span>₹${Number(invoice.total || 0).toLocaleString("en-IN")}</span>
            </div>

            <hr />

            <p><b>Payment Status:</b> ${invoice.paymentStatus}</p>
            <p><b>Booking Status:</b> ${invoice.bookingStatus}</p>
            <p><b>Date:</b> ${invoice.date}</p>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const totalInvoiceAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.paymentStatus === "Paid"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Invoices</h1>
        <p className="text-slate-500 mt-1">
          View and print your hotel invoices.
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
          <p className="text-sm text-slate-500">Total Amount</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{totalInvoiceAmount.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 mb-6">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search invoices..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-slate-50 rounded-2xl p-6 border shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Receipt size={22} />
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    invoice.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {invoice.paymentStatus || "Pending"}
                </span>
              </div>

              <h2 className="text-xl font-bold mt-5">{invoice.invoiceNo}</h2>

              <p className="text-sm text-slate-500 mt-1">
                Room: {invoice.roomType} - {invoice.roomNumber}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Check In: {invoice.checkIn || "N/A"}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Check Out: {invoice.checkOut || "N/A"}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Date: {invoice.date}
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>
                  Room Charges: ₹
                  {Number(invoice.roomTotal || 0).toLocaleString("en-IN")}
                </p>

                <p>
                  Food Charges: ₹
                  {Number(invoice.foodTotal || 0).toLocaleString("en-IN")}
                </p>

                <p>
                  GST: ₹{Number(invoice.gst || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <p className="text-3xl font-bold mt-5">
                ₹{Number(invoice.total || 0).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => printInvoice(invoice)}
                className="mt-5 w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Invoice
              </button>
            </div>
          ))}

          {filteredInvoices.length === 0 && (
            <p className="text-slate-500">No invoices generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerInvoices;