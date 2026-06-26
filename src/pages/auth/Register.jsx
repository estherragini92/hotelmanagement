import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hotel, User, Mail, Lock, ArrowLeft } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = register(
      formData.name,
      formData.email,
      formData.password
    );

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Registration successful. Please login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl min-h-[88vh] bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        <div
          className="relative hidden lg:flex flex-col justify-end p-12 text-white bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(2,6,23,0.15), rgba(2,6,23,0.95)), url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute top-10 left-10">
            <h1 className="text-3xl font-bold tracking-wide">
              LUXURY STAY
            </h1>
            <p className="text-amber-300 tracking-[0.3em] text-sm mt-1">
              HOTEL & RESORT
            </p>
          </div>

          <div>
            <p className="text-amber-400 font-semibold mb-3">
              CREATE ACCOUNT
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Book Rooms. Order Food. Enjoy Services.
            </h2>

            <p className="text-slate-200 mt-4 text-lg max-w-xl">
              Register as a customer and manage your hotel experience from one
              simple portal.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <form onSubmit={handleRegister} className="w-full max-w-xl">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-500 mb-8"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>

            <div className="text-center mb-8">
              <Hotel className="mx-auto text-slate-950" size={56} />

              <h2 className="text-4xl font-bold mt-5 text-slate-950">
                Create Account
              </h2>

              <p className="text-slate-500 mt-2">
                Register as a hotel customer
              </p>
            </div>

            <div className="relative mb-5">
              <User className="absolute left-4 top-4 text-slate-500" size={21} />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-slate-200 rounded-xl py-4 pl-13 pr-4 text-slate-700"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative mb-5">
              <Mail className="absolute left-4 top-4 text-slate-500" size={21} />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border border-slate-200 rounded-xl py-4 pl-13 pr-4 text-slate-700"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative mb-5">
              <Lock className="absolute left-4 top-4 text-slate-500" size={21} />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border border-slate-200 rounded-xl py-4 pl-13 pr-4 text-slate-700"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="relative mb-6">
              <Lock className="absolute left-4 top-4 text-slate-500" size={21} />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border border-slate-200 rounded-xl py-4 pl-13 pr-4 text-slate-700"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 text-white py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition"
            >
              Register
            </button>

            <p className="text-center text-slate-500 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-950 font-bold">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;