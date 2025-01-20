import React from "react";
import CartTable from "../_components/CartPage/CartTable";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { api } from "~/trpc/server";

const CartPage = async () => {
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
    <section className="h-full min-h-[100vh] w-full">
      <CartTable userId={userId} />
    </section>
  );
};

export default CartPage;
