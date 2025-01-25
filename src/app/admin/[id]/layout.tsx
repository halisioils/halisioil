import type { Metadata } from "next";
import Banner from "~/utils/Banner";
import { poppins } from "~/utils/font";

export const metadata: Metadata = {
  title: "Admin - Halisi oil",
  description: "Halisi",
  keywords: "Halisi",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AdminProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`${poppins.className} mx-auto h-[100%] min-h-screen w-[100%] max-w-[1400px] bg-bgGray`}
    >
      <Banner prev="Admin" next="Product" head="Admin" />
      {children}
    </main>
  );
}
