"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import Products from "./Products";
import LoadingComponent from "~/utils/LoadingComponent";

const DashboardComponent = () => {
  const searchParams = useSearchParams();
  const active_section = searchParams.get("section");

  // Function to render the component based on `toggled url state`
  const renderComponent = () => {
    switch (active_section) {
      case "dashboard":
        return <div>Dashboard</div>;
      case "products":
        return <Products />;
      case "categories":
        return <div>categories</div>;
      case "orders":
        return <p>orders</p>;
      case "settings":
        return <p>settings</p>;
      default:
        return <div>default</div>;
    }
  };

  return <section>{renderComponent()}</section>;
};

const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default Dashboard;
