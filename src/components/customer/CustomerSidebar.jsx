import { NavLink, useNavigate } from "react-router-dom";
import {
  Crown,
  LayoutDashboard,
  BedDouble,
  Utensils,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  Headphones,
  LogOut,
  Receipt,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
  { name: "Rooms", path: "/customer/rooms", icon: BedDouble },
  { name: "Food & Dining", path: "/customer/food", icon: Utensils },
  { name: "My Bookings", path: "/customer/bookings", icon: CalendarCheck },
  { name: "Payments", path: "/customer/payments", icon: CreditCard },
  { name: "Requests", path: "/customer/requests", icon: MessageSquare },
  { name: "Profile", path: "/customer/profile", icon: User },
  { name: "Notifications", path: "/customer/notifications", icon: Bell },
  { name: "Support", path: "/customer/support", icon: Headphones },
  {
  name: "Invoices",
  icon: Receipt,
  path: "/customer/invoices",
},
];

function CustomerSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-slate-950 text-white lg:flex flex-col">
      <div className="px-7 py-8">
        <div className="flex flex-col items-center text-center">
          <Crown size={46} className="text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-400 mt-3">
            LUXURY STAY
          </h1>
          <p className="text-xs tracking-[0.35em] text-amber-300">
            HOTEL & RESORT
          </p>
        </div>
      </div>

      <nav className="px-3 space-y-2 flex-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-amber-400"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={21} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-4 rounded-xl px-4 py-4 text-sm text-slate-200 hover:bg-white/10"
      >
        <LogOut size={21} />
        Logout
      </button>
    </aside>
  );
}

export default CustomerSidebar;