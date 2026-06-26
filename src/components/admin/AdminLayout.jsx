import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminHeader />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;