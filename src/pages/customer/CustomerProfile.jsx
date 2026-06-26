import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getCustomerData,
  setCustomerData,
} from "../../utils/customerStorage";

function CustomerProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idProof: "Aadhaar",
  });

  useEffect(() => {
    const savedProfile = getCustomerData("hotelCustomerProfile");

    if (savedProfile && savedProfile.name) {
      setProfile(savedProfile);
    } else {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        idProof: "Aadhaar",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = (e) => {
    e.preventDefault();

    setCustomerData("hotelCustomerProfile", profile);

    alert("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal information and contact details.
        </p>
      </div>

      <form
        onSubmit={saveProfile}
        className="bg-white rounded-2xl p-6 border shadow-sm max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-14 w-14 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <User size={26} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {profile.name || "Customer"}
            </h2>
            <p className="text-sm text-slate-500">
              {profile.email || user?.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border rounded-xl px-4 py-3"
            value={profile.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-xl px-4 py-3"
            value={profile.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="border rounded-xl px-4 py-3"
            value={profile.phone}
            onChange={handleChange}
          />

          <select
            name="idProof"
            className="border rounded-xl px-4 py-3"
            value={profile.idProof}
            onChange={handleChange}
          >
            <option>Aadhaar</option>
            <option>Passport</option>
            <option>Driving License</option>
            <option>Voter ID</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            className="border rounded-xl px-4 py-3 md:col-span-2 min-h-28"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Save size={18} />
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default CustomerProfile;