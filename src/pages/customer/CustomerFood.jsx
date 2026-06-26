import { useEffect, useState } from "react";
import { ShoppingCart, Heart, CreditCard, X } from "lucide-react";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";
import { notifyHotelUpdate, HOTEL_EVENTS } from "../../utils/hotelEvents";

const menuItems = [
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
    category: "Dessert",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  },
];

function CustomerFood() {
  const [orders, setOrders] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = getCustomerData("hotelCustomerFoodOrders");
      setOrders(savedOrders);
    };

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener("hotelFoodUpdate", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("hotelFoodUpdate", loadOrders);
    };
  }, []);

  const orderFood = (item) => {
    const customerOrders = getCustomerData("hotelCustomerFoodOrders");
    const adminOrders =
      JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];

    const currentUser = JSON.parse(localStorage.getItem("hotelUser"));

    const newOrder = {
      id: Date.now(),
      guestName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "",
      roomNumber: "Customer Room",
      item: item.name,
      category: item.category,
      quantity: 1,
      amount: Number(item.price),
      price: Number(item.price),
      status: "Ordered",
      paymentStatus: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
      source: "Customer Portal",
    };

    const updatedCustomerOrders = [...customerOrders, newOrder];
    const updatedAdminOrders = [...adminOrders, newOrder];

    setOrders(updatedCustomerOrders);
    setCustomerData("hotelCustomerFoodOrders", updatedCustomerOrders);

    localStorage.setItem("hotelFoodOrders", JSON.stringify(updatedAdminOrders));

    notifyHotelUpdate(HOTEL_EVENTS.FOOD);

    alert("Food order sent to admin successfully");
  };

  const openFoodPaymentForm = (order) => {
    setSelectedOrder(order);
    setCardData({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
    setShowPaymentForm(true);
  };

  const handleCardChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const payFoodOrder = (e) => {
    e.preventDefault();

    if (
      !cardData.cardName ||
      !cardData.cardNumber ||
      !cardData.expiry ||
      !cardData.cvv
    ) {
      alert("Please fill all card details");
      return;
    }

    if (cardData.cardNumber.length !== 16) {
      alert("Card number must be 16 digits");
      return;
    }

    if (cardData.cvv.length !== 3) {
      alert("CVV must be 3 digits");
      return;
    }

    const orderId = selectedOrder.id;

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, paymentStatus: "Paid" } : order
    );

    setOrders(updatedOrders);
    setCustomerData("hotelCustomerFoodOrders", updatedOrders);

    const adminOrders = JSON.parse(localStorage.getItem("hotelFoodOrders")) || [];

    const updatedAdminOrders = adminOrders.map((order) =>
      order.id === orderId ? { ...order, paymentStatus: "Paid" } : order
    );

    localStorage.setItem("hotelFoodOrders", JSON.stringify(updatedAdminOrders));

    const paidOrder = updatedOrders.find((order) => order.id === orderId);

    const payments = JSON.parse(localStorage.getItem("hotelPayments")) || [];

    const alreadyPaid = payments.some((payment) => payment.orderId === orderId);

    if (!alreadyPaid && paidOrder) {
      const newPayment = {
        id: Date.now(),
        invoiceNo: `FOOD-${Date.now()}`,
        guestName: paidOrder.guestName || "Customer",
        customerEmail: paidOrder.customerEmail || "",
        roomNumber: paidOrder.roomNumber,
        amount: Number(paidOrder.amount || paidOrder.price || 0),
        method: "Card",
        cardLast4: cardData.cardNumber.slice(-4),
        status: "Paid",
        date: new Date().toISOString().split("T")[0],
        orderId,
        source: "Customer Food Order",
      };

      localStorage.setItem(
        "hotelPayments",
        JSON.stringify([...payments, newPayment])
      );
    }

    setShowPaymentForm(false);
    setSelectedOrder(null);

    notifyHotelUpdate(HOTEL_EVENTS.FOOD, HOTEL_EVENTS.PAYMENTS);

    alert("Food payment successful. Admin payments updated.");
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl p-8 text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.95), rgba(2,6,23,0.35)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <h1 className="text-4xl font-bold">Food & Dining</h1>
        <p className="text-slate-200 mt-3">
          Order delicious meals directly to your room.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-5">
          Popular Food
        </h2>

        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border shadow-sm"
            >
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

                <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center">
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.category}</p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold">₹{item.price}</p>

                  <button
                    onClick={() => orderFood(item)}
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
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="text-xl font-bold mb-5">My Food Orders</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-slate-50 border p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-bold">{order.item}</h3>
                <p className="text-sm text-slate-500">
                  {order.category} • {order.date}
                </p>
                <p className="text-sm text-slate-500">
                  Quantity: {order.quantity || 1}
                </p>
              </div>

              <div className="md:text-right">
                <p className="font-bold">
                  ₹
                  {Number(order.price || order.amount || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Preparing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Order: {order.status}
                </span>

                <span
                  className={`block mt-2 px-3 py-1 rounded-full text-xs ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Payment: {order.paymentStatus || "Pending"}
                </span>

                {order.paymentStatus !== "Paid" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => openFoodPaymentForm(order)}
                      className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 md:ml-auto"
                    >
                      <CreditCard size={15} />
                      Pay Food Bill
                    </button>
                  )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-slate-500">No food orders yet.</p>
          )}
        </div>
      </div>

      {showPaymentForm && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <form
            onSubmit={payFoodOrder}
            className="bg-white rounded-2xl p-6 w-full max-w-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold">Food Payment</h2>
                <p className="text-sm text-slate-500">
                  Pay ₹
                  {Number(
                    selectedOrder.amount || selectedOrder.price || 0
                  ).toLocaleString("en-IN")}{" "}
                  for {selectedOrder.item}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 text-white p-5 mb-5">
              <p className="text-sm text-slate-300">Credit / Debit Card</p>

              <h3 className="text-2xl font-bold mt-4 tracking-widest">
                {cardData.cardNumber || "0000 0000 0000 0000"}
              </h3>

              <div className="flex justify-between mt-5 text-sm">
                <p>{cardData.cardName || "CARD HOLDER"}</p>
                <p>{cardData.expiry || "MM/YY"}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                name="cardName"
                placeholder="Card Holder Name"
                className="border rounded-xl px-4 py-3"
                value={cardData.cardName}
                onChange={handleCardChange}
              />

              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                maxLength="16"
                className="border rounded-xl px-4 py-3"
                value={cardData.cardNumber}
                onChange={handleCardChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="border rounded-xl px-4 py-3"
                  value={cardData.expiry}
                  onChange={handleCardChange}
                />

                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="3"
                  className="border rounded-xl px-4 py-3"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl"
              >
                Approve Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerFood;