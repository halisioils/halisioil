"use client";

import { Suspense } from "react";
import LoadingComponent from "./LoadingComponent";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteProducts from "~/app/_components/DeleteProducts";
import DeleteCategory from "~/app/_components/DeleteCategory";
import RemoveAdmin from "~/app/_components/RemoveAdmin";

const ModalComponent = () => {
  const searchParams = useSearchParams();
  const active_section = searchParams.get("case");
  const router = useRouter();

  const renderModalContent = () => {
    switch (active_section) {
      case "product_delete":
        return <DeleteProducts />;
      case "category_delete":
        return <DeleteCategory />;
      case "admin_remove":
        return <RemoveAdmin />;

      default:
        return null;
    }
  };

  return (
    <>
      {active_section && (
        <dialog className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-black bg-opacity-20">
          <div className="m-auto py-[2rem] lg:p-8">
            <div className="relative flex flex-col items-center">
              <div className="text-primary_black absolute right-[2rem] top-[1rem] z-10">
                <button type="button" onClick={() => router.back()}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 7L17 17M7 17L17 7"
                      stroke="#363636"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {renderModalContent()}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

const Modal = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ModalComponent />
    </Suspense>
  );
};

export default Modal;
