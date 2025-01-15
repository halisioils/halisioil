import React from "react";
import LoadingComponent from "~/utils/LoadingComponent";

const Loading = () => {
  return (
    <section className="relative mx-auto flex h-full min-h-[70vh] w-[100%] max-w-[1100px] justify-center pt-[2rem]">
      <LoadingComponent />
    </section>
  );
};

export default Loading;
