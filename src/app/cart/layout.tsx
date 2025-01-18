import type { Metadata } from "next";
import Banner from "~/utils/Banner";
import { poppins } from "~/utils/font";

export const metadata: Metadata = {
  title: "Cart - Halisi oil",
  description: "Halisi",
  keywords: "Halisi",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`${poppins.className} mx-auto h-[100%] min-h-screen w-[100%] max-w-[1400px] gap-[1rem] bg-bgGray px-[1rem] pb-[2rem] pt-[1rem] md:px-[2rem]`}
    >
      <Banner prev="Home" next="Cart" head="Cart" />

      {children}
    </main>
  );
}
