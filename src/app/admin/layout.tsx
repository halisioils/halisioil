import type { Metadata } from "next";
import { poppins } from "~/utils/font";
import AdminNav from "../_components/AdminPage/AdminNav";
import MobileAdminNav from "../_components/AdminPage/MobileAdminNav";

export const metadata: Metadata = {
  title: "Admin - Halisi oil",
  description: "Halisi",
  keywords: "Halisi",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`${poppins.className} mx-auto flex h-[100%] min-h-screen w-[100%] max-w-[1400px] gap-[1rem] bg-bgGray px-[1rem] py-[2rem] md:gap-[2rem] md:px-[2rem]`}
    >
      <AdminNav />
      <MobileAdminNav />
      {children}
    </main>
  );
}
