import Image from "next/image";
import Link from "next/link";
import React from "react";
import { poppins } from "~/utils/font";
import logo_image from "~/assets/halisioils_logo.png";
import { navLinks } from "~/utils/NavLinks";
import { helpLinks } from "~/utils/helpLinks";

const Footer = () => {
  return (
    <section
      className={`mx-auto flex h-full w-full flex-wrap justify-between gap-[1rem] ${poppins.className} mx-auto max-w-[1240px] px-[1rem] py-[2rem] md:px-[2rem] lg:px-[3rem]`}
    >
      <Link href={`/`} className="relative h-[50px] w-[100px] cursor-pointer">
        <Image
          quality={100}
          fill
          sizes="(min-width: 768px) 100vw, 700px"
          src={logo_image}
          priority
          alt="background image"
          style={{
            objectFit: "contain",
          }}
        />
      </Link>
      <nav className="">
        <h3 className="text-[#a9acbb]">Links</h3>
        <ul className="flex flex-col gap-[0.5rem] pt-[1rem] text-[1rem]">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                className={`text-[1rem] text-[#253D4E] transition-all duration-300 ease-in-out hover:text-[#a9acbb]`}
                href={href}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="">
        <h3 className="text-[#a9acbb]">Help</h3>
        <ul className="flex flex-col gap-[0.5rem] pt-[1rem]">
          {helpLinks.map((link, index) => (
            <li key={index}>
              <Link
                scroll={true}
                className={`text-[1rem] text-[#253D4E] transition-all duration-300 ease-in-out hover:text-[#a9acbb]`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-[#a9acbb]">Newletter</h3>
      </section>
    </section>
  );
};

export default Footer;
