import Image from "next/image";
import React from "react";
import { raleway } from "~/utils/font";
import image_route from "~/assets/DSC00014.jpg";
import Overview from "../_components/AboutPage/Overview";
import Accordian from "~/utils/Accordian";
import Link from "next/link";

const AboutPage = async () => {
  return (
    <section className="h-full min-h-[100vh] w-full py-[2rem]">
      <section className="mx-auto my-[1rem] flex max-w-[1000px] flex-col gap-[1rem] md:flex-row md:gap-[2rem]">
        <section className="h-[100%] w-[100%] flex-col items-center justify-center gap-[1rem]">
          <div className="relative mx-auto mb-[2rem] h-[350px] w-[100%] rounded-[1rem] border-[1px] border-[#ECECEC] md:rounded-[0.75rem]">
            <Image
              src={image_route}
              alt={`Placeholder image for Halisi About`}
              sizes="(min-width: 768px) 100vw, 700px"
              priority
              placeholder="blur"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              className="rounded-[1rem]"
            />
          </div>
        </section>
        <section className="flex w-[100%] flex-col justify-start gap-[0.5rem] md:w-[70%] md:gap-[1rem]">
          <h2
            className={`${raleway.className} text-[2rem] font-bold leading-[48px] text-[#253D4E]`}
          >
            Welcome to Halisi
          </h2>

          <p className="text-justify text-[1rem] leading-[24px] text-[#7E7E7E]">
            Welcome to Halisi, where we craft pure, effective organic oils.
            Guided by our belief in nature&apos;s power for true wellness, we
            source the finest organic ingredients to nurture your body and
            spirit.
          </p>
          <p className="text-justify text-[1rem] leading-[24px] text-[#7E7E7E]">
            At Halisi, our mission is to provide high-quality natural oils that
            promote health and well-being. Committed to sustainability and
            ethics, we ensure our products benefit both our customers and the
            communities and environments we source from.
          </p>
        </section>
      </section>

      <Overview />
      <div className={`my-[3rem] flex w-[100%] items-center justify-center`}>
        <Link
          className={`flex h-[55px] w-[200px] items-center justify-center rounded bg-[#B88E2F] font-bold text-white hover:brightness-75`}
          href={`/shop`}
        >
          Discover Now
        </Link>
      </div>
      <div className="mx-auto mt-[3rem] max-w-[800px]">
        <h2
          className={`text-center text-[1.5rem] font-semibold text-[#B88E2F] md:text-[2rem] ${raleway.className} `}
        >
          Frequently Asked Questions
        </h2>

        <Accordian />
      </div>
    </section>
  );
};

export default AboutPage;
