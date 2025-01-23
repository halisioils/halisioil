import React from "react";
import { raleway } from "~/utils/font";
import Order from "../_components/OrderPage/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  let userId = "";

  if (user?.email) {
    const response = await api.user.getLoggedInUser({
      email: user.email,
    });

    userId = response?.id ?? "";
  }

  return (
    <section className="h-full min-h-[100vh] w-full py-[1rem] md:py-[2rem]">
      <h2
        className={`text-[1.5rem] font-semibold leading-[1rem] text-[#84919A] md:text-[2rem] ${raleway.className}`}
      >
        Orders
      </h2>
      <Order userId={userId} />
    </section>
  );
};

export default DashboardPage;
