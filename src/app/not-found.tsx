import Image from "next/image";
import Link from "next/link";
import React from "react";

import notFoundImage from "~/assets/amber.jpg";

const NotFound = () => {
  return (
    <section className="text-primary_black mx-auto flex h-[80vh] max-w-[627px] flex-col items-center justify-center gap-[4rem]">
      <div className="mx-auto flex w-[100%] flex-col gap-[2.5rem]">
        <div className="relative mx-auto flex h-[84px] w-[203.94px] items-center justify-center md:h-[195.44px] md:w-[474.51px]">
          <Image
            quality={100}
            fill
            sizes="(min-width: 768px) 100vw, 700px"
            src={notFoundImage}
            priority
            alt="background image"
            className="rounded-[3rem]"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-[4px]">
          <h3 className="text-center text-[1.5rem] font-[700] leading-[28.18px]">
            OOPS! PAGE NOT FOUND
          </h3>
          <p className="max-w-[457px] px-[1rem] text-center text-[0.875rem] leading-[1.5rem]">
            The page you are looking for might have been removed or its
            temporary unavailable. Please return to the homepage. Thank you.
          </p>
        </div>
      </div>
      <Link
        href={`/`}
        className="h-[41px] w-fit rounded-[6.25rem] border-0 bg-[#286F6C] px-[2rem] py-[0.75rem] text-[0.875rem] text-white focus:outline-none"
      >
        Back to Homepage
      </Link>
    </section>
  );
};

export default NotFound;
