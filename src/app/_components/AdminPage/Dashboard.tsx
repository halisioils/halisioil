"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import Products from "./Products";
import LoadingComponent from "~/utils/LoadingComponent";
import Categories from "./Categories";
import Admins from "./Admins";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Orders from "./Orders";

const DashboardComponent = () => {
  const searchParams = useSearchParams();
  const active_section = searchParams.get("section");

  const { getUser, isLoading } = useKindeBrowserClient();

  const user = getUser();

  const displayName = user?.given_name ?? "Admin";

  // Function to render the component based on `toggled url state`
  const renderComponent = () => {
    switch (active_section) {
      case "dashboard":
        return <div>Dashboard</div>;
      case "products":
        return <Products />;
      case "categories":
        return <Categories />;
      case "orders":
        return <Orders />;
      case "admins":
        return <Admins />;

      default:
        return <div>default</div>;
    }
  };

  return (
    <section>
      {isLoading ? (
        <div className="mb-[2rem]">
          <LoadingComponent />
        </div>
      ) : (
        <h1 className="mb-[2rem] text-[1.75rem] font-bold text-[#252c32]">
          Hi, {displayName}
        </h1>
      )}
      {renderComponent()}
    </section>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default Dashboard;
