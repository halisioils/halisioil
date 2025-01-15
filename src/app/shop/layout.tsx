import type { Metadata } from "next";
import { poppins } from "~/utils/font";
import ShopPageNav from "../_components/ShopPage/ShopPageNav";
import Banner from "~/utils/Banner";
import MobileShopPageNav from "../_components/ShopPage/MobileShopPageNav";

export const metadata: Metadata = {
  title: "Shop - Halisi oil",
  description: "Halisi",
  keywords: "Halisi",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`${poppins.className} mx-auto h-[100%] min-h-screen w-[100%] max-w-[1400px] gap-[1rem] bg-bgGray px-[1rem] py-[2rem] md:gap-[2rem] md:px-[2rem]`}
    >
      <Banner prev="Home" next="Shop" head="Shop" />
      <section className="flex gap-[1rem] py-[2rem]">
        <ShopPageNav />
        <MobileShopPageNav />
        {children}
      </section>
    </main>
  );
}
