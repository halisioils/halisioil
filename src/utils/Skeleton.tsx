import Image from "next/image";
import React from "react";
import dashboardSkeleton from "~/assets/dashboard_skeleton_image.png";

const Skeleton = () => {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-[1.5rem] h-[142.37px] w-[183px]">
          <Image
            quality={100}
            fill
            sizes="(min-width: 768px) 100vw, 700px"
            src={dashboardSkeleton}
            priority
            alt="background image"
            className="rounded-[3rem]"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <h5 className="text-center text-[1.5rem] font-[700]">No Data Found</h5>
        <p className="pb-[2.5rem] text-center text-[1rem] font-[400]">
          Manage all your data here.
        </p>
      </div>
    </section>
  );
};

export default Skeleton;
