import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Hotel,
  Mail,
  Lock,
  Shield,
  User,
  Eye,
  BedDouble,
  Users,
  BarChart3,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@hotel.com");
  const [password, setPassword] = useState("admin123");

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    if (selectedRole === "admin") {
      setEmail("admin@hotel.com");
      setPassword("admin123");
    } else {
      setEmail("customer@hotel.com");
      setPassword("customer123");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = login(email, password);

    if (!user) {
      alert("Invalid Email or Password");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-7xl min-h-[92vh] bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left Side */}
        <div
          className="relative hidden lg:flex flex-col justify-end p-12 text-white bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(2,6,23,0.15), rgba(2,6,23,0.95)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute top-10 left-10">
            <div className="text-3xl font-bold tracking-wide">
              LUXURY STAY
            </div>
            <p className="text-amber-300 tracking-[0.3em] text-sm mt-1">
              HOTEL & RESORT
            </p>
          </div>

          <div>
            <p className="text-amber-400 font-semibold mb-3">WELCOME TO</p>

            <h1 className="text-5xl font-bold leading-tight">
              Hotel Management System
            </h1>

            <p className="text-slate-200 mt-4 text-lg max-w-xl">
              Manage bookings, guests, rooms, payments and hospitality services
              with one powerful dashboard.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <Feature icon={BedDouble} title="Room Management" />
              <Feature icon={Users} title="Customer Service" />
              <Feature icon={BarChart3} title="Reports & Analytics" />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-10">
          <form onSubmit={handleLogin} className="w-full max-w-xl">
            <div className="text-center mb-8">
              <Hotel className="mx-auto text-slate-950" size={60} />

              <h2 className="text-4xl font-bold mt-5 text-slate-950">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2">
                Login to continue your hotel experience
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`py-4 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                  role === "admin"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                <Shield size={20} />
                Admin
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("customer")}
                className={`py-4 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                  role === "customer"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                <User size={20} />
                Customer
              </button>
            </div>

            {/* Email */}
            <div className="relative mb-5">
              <Mail
                size={20}
                className="absolute left-4 top-4 text-slate-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-slate-300 rounded-xl py-4 pl-12 pr-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative mb-5">
              <Lock
                size={20}
                className="absolute left-4 top-4 text-slate-500"
              />

              <Eye
                size={20}
                className="absolute right-4 top-4 text-slate-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded-xl py-4 pl-12 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-sm text-slate-500 mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="hover:text-slate-900"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-slate-400 text-sm">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-slate-300 py-4 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Continue with Google
            </button>

            {/* Register */}
            <p className="text-center text-slate-500 mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-slate-900"
              >
                Register Here
              </Link>
            </p>

            {/* Demo Credentials */}
            <div className="mt-8 bg-slate-100 rounded-xl p-4 text-sm">
              <p className="font-bold mb-2">Demo Credentials</p>

              <p>
                <strong>Admin:</strong> admin@hotel.com / admin123
              </p>

              <p>
                <strong>Customer:</strong> customer@hotel.com / customer123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div>
      <div className="h-14 w-14 rounded-full border border-amber-400 text-amber-400 flex items-center justify-center mb-3">
        <Icon size={24} />
      </div>

      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

export default Login;