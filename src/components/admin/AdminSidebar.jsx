import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  CreditCard,
  Sparkles,
  MessageSquare,
  UserCog,
  Utensils,
  BarChart3,
  Settings,
  Hotel,
  Receipt,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Rooms",
    path: "/admin/rooms",
    icon: BedDouble,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Guests",
    path: "/admin/guests",
    icon: Users,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Housekeeping",
    path: "/admin/housekeeping",
    icon: Sparkles,
  },
  {
    name: "Customer Requests",
    path: "/admin/customer-requests",
    icon: MessageSquare,
  },
  {
    name: "Staff",
    path: "/admin/staff",
    icon: UserCog,
  },
  {
    name: "Restaurant",
    path: "/admin/restaurant",
    icon: Utensils,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
   name:"Invoices",
   icon:Receipt,
   path:"/admin/invoices"
},
];

function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-slate-950 text-white lg:block overflow-y-auto">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center">
          <Hotel size={28} />
        </div>

        <div>
          <h1 className="text-xl font-bold">LuxuryStay</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="mt-6 px-4 space-y-2 pb-6">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;