import React from "react";
import { raleway } from "~/utils/font";

const Overview = () => {
  return (
    <section className="mt-[2rem] rounded-[15px] bg-black py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 lg:gap-y-16">
          <div>
            <div className="relative mx-auto flex items-center justify-center">
              <svg
                className="text-gray-500"
                width="62"
                height="64"
                viewBox="0 0 62 64"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M62 13.001C62 33.4355 53.9345 64.001 33.5 64.001C13.0655 64.001 0 50.435 0 30.0005C0 9.56596 2.56546 4.00021 23 4.00021C43.4345 4.00021 62 -7.43358 62 13.001Z"></path>
              </svg>

              <svg
                className="absolute h-9 w-9 text-gray-600"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="100" height="100" fill="url(#pattern0_3_2)" />
                <defs>
                  <pattern
                    id="pattern0_3_2"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_3_2" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_3_2"
                    width="100"
                    height="100"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
            <h3
              className={`${raleway.className} mt-8 text-lg font-semibold text-[#B88E2F]`}
            >
              100% Organic
            </h3>
            <p className="mt-4 text-base text-white">
              We believe in the power of nature to provide the best for your
              well-being. Our products are made with 100% organic ingredients.
            </p>
          </div>

          <div>
            <div className="relative mx-auto flex items-center justify-center">
              <svg
                className="text-rose-500"
                width="72"
                height="75"
                viewBox="0 0 72 75"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M63.6911 28.8569C68.0911 48.8121 74.6037 61.2674 53.2349 65.9792C31.8661 70.6909 11.6224 61.2632 7.22232 41.308C2.82229 21.3528 3.6607 12.3967 25.0295 7.68503C46.3982 2.97331 59.2911 8.90171 63.6911 28.8569Z" />
              </svg>

              <svg
                className="absolute h-9 w-9 text-rose-600"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="100" height="100" fill="url(#pattern0_1_5)" />
                <defs>
                  <pattern
                    id="pattern0_1_5"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1_5" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1_5"
                    width="100"
                    height="100"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
            <h3
              className={`${raleway.className} mt-8 text-lg font-semibold text-[#B88E2F]`}
            >
              Biological Safe
            </h3>
            <p className="mt-4 text-base text-white">
              Your safety is our priority at Halisi. Our products are
              biologically safe, meaning they are gentle on your skin and body.
            </p>
          </div>

          <div>
            <div className="relative mx-auto flex items-center justify-center">
              <svg
                className="text-lime-500"
                width="72"
                height="75"
                viewBox="0 0 72 75"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M63.6911 28.8569C68.0911 48.8121 74.6037 61.2674 53.2349 65.9792C31.8661 70.6909 11.6224 61.2632 7.22232 41.308C2.82229 21.3528 3.6607 12.3967 25.0295 7.68503C46.3982 2.97331 59.2911 8.90171 63.6911 28.8569Z" />
              </svg>
              <svg
                className="absolute h-9 w-9 text-lime-900"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="100" height="100" fill="url(#pattern0_1_2)" />
                <defs>
                  <pattern
                    id="pattern0_1_2"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1_2" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1_2"
                    width="100"
                    height="100"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
            <h3
              className={`${raleway.className} mt-8 text-lg font-semibold text-[#B88E2F]`}
            >
              Improve Health
            </h3>
            <p className="mt-4 text-base text-white">
              Enhance your well-being with Halisi&apos;s organic oils, designed
              to support and improve your health naturally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
