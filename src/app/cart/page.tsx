import React from "react";
import CartTable from "../_components/CartPage/CartTable";
import { api } from "~/trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CartPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let id = "";

  if (user?.email) {
    const response = await api.user.getLoggedInUser({ email: user.email });

    if (response) {
      id = response.id;
    }
  }

  return (
    <section className="h-full min-h-[100vh] w-full">
      <CartTable userId={id} />
    </section>
  );
};

export default CartPage;
