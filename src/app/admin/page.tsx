import React from "react";
import Dashboard from "../_components/AdminPage/Dashboard";
import MobileSectionButton from "~/utils/MobileSectionButton";
import AdminNav from "../_components/AdminPage/AdminNav";
import MobileAdminNav from "../_components/AdminPage/MobileAdminNav";

const AdminPage = async () => {
  return (
    <section className="flex">
      <div>
        <AdminNav />
        <MobileAdminNav />
      </div>

      <section className="flex-1 overflow-hidden">
        <MobileSectionButton />
        <Dashboard />
      </section>
    </section>
  );
};

export default AdminPage;
