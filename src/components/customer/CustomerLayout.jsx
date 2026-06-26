import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <CustomerSidebar />

      <div className="lg:ml-72">
        <CustomerHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;