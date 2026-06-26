import { useEffect, useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";

const defaultSettings = {
  hotelName: "LuxuryStay Hotel",
  email: "info@luxurystay.com",
  phone: "9876543210",
  address: "Chennai, Tamil Nadu",
  gstNumber: "33ABCDE1234F1Z5",
  checkInTime: "12:00",
  checkOutTime: "11:00",
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("hotelSettings"));

    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("hotelSettings", JSON.stringify(settings));
    alert("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Hotel Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage hotel profile, contact details and check-in rules.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl p-6 border shadow-sm max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <SettingsIcon size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">General Information</h2>
            <p className="text-sm text-slate-500">
              Update your hotel business details.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="hotelName"
            placeholder="Hotel Name"
            className="border rounded-xl px-4 py-3"
            value={settings.hotelName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-xl px-4 py-3"
            value={settings.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="border rounded-xl px-4 py-3"
            value={settings.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gstNumber"
            placeholder="GST Number"
            className="border rounded-xl px-4 py-3"
            value={settings.gstNumber}
            onChange={handleChange}
          />

          <input
            type="time"
            name="checkInTime"
            className="border rounded-xl px-4 py-3"
            value={settings.checkInTime}
            onChange={handleChange}
          />

          <input
            type="time"
            name="checkOutTime"
            className="border rounded-xl px-4 py-3"
            value={settings.checkOutTime}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Hotel Address"
            className="border rounded-xl px-4 py-3 md:col-span-2"
            value={settings.address}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Save size={18} />
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;