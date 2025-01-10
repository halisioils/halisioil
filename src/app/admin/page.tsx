import React from "react";
import Dashboard from "../_components/AdminPage/Dashboard";
import MobileSectionButton from "~/utils/MobileSectionButton";

const AdminPage = async () => {
  return (
    <section className="flex-1 overflow-hidden">
      <MobileSectionButton />
      <Dashboard />
    </section>
  );
};

export default AdminPage;
