import React from "react";
import Failed from "../_components/Failed";

const FailedPage = async () => {
  return (
    <section
      className={`mx-auto flex h-[100%] min-h-screen w-[100%] max-w-[1400px] items-center justify-center gap-[1rem] bg-bgGray px-[1rem] pb-[2rem] pt-[1rem] md:px-[2rem]`}
    >
      <Failed />
    </section>
  );
};

export default FailedPage;
