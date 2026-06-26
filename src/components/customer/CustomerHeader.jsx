import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CustomerHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-7 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || "Customer"} 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Book rooms, order food and enjoy your stay.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-slate-950 text-white px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;