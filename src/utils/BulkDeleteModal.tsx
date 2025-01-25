"use client";
import React, { useState, type FC } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import LoadingComponent from "./LoadingComponent";
interface BulkDeleteModalProps {
  ids: string[];
  keys: string[];
  onClose: () => void;
  onSelected: () => void;
}

const BulkDeleteModal: FC<BulkDeleteModalProps> = ({
  ids,
  keys,
  onClose,
  onSelected,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const utils = api.useUtils();

  const deleteBulkProducts = api.product.deleteMany.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      toast.success(`${data.count} Product(s) deleted successfully`);

      onClose();
      onSelected();
    },
    onError: (error) => {
      const zodErrorMessages = error.data?.zodError?.fieldErrors;

      if (zodErrorMessages && typeof zodErrorMessages === "object") {
        const errorData = Object.fromEntries(
          Object.entries(zodErrorMessages).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : "", // Extract the first error message if it's an array
          ]),
        );

        if (errorData.ids) {
          toast.error(`${errorData.ids}`);
        }

        if (errorData.keys) {
          toast.error(`${errorData.keys}`);
        }
      } else {
        setErrorMessage(
          error.message ?? "Something went wrong. Please try again.",
        );
      }
    },
  });

  const handleBulkDelete = () => {
    try {
      deleteBulkProducts.mutate({
        ids,
        keys,
      });
    } catch (error) {
      toast(`Unknown error occured`);
    }
  };

  return (
    <dialog className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-black bg-opacity-20">
      <div className="m-auto py-[2rem] lg:p-8">
        <div className="relative flex flex-col items-center">
          <div className="text-primary_black absolute right-[2rem] top-[1rem] z-10">
            <button type="button" onClick={onClose}>
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
          <section className="relative flex w-[90vw] flex-col items-center justify-center gap-[1.5rem] rounded-[0.5rem] bg-white px-[2.5rem] py-[2rem] md:w-[400px]">
            {errorMessage && (
              <p className="my-4 w-full rounded-sm bg-red-100 p-[0.5rem] text-center text-sm text-red-500">
                {errorMessage}
              </p>
            )}
            <div className="flex flex-col items-center justify-center gap-[0.25rem]">
              <span className="flex h-[3rem] w-[3rem] items-center justify-center rounded-[28px] bg-[#FEE4E2]">
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 5V4.2C14 3.0799 14 2.51984 13.782 2.09202C13.5903 1.71569 13.2843 1.40973 12.908 1.21799C12.4802 1 11.9201 1 10.8 1H9.2C8.07989 1 7.51984 1 7.09202 1.21799C6.71569 1.40973 6.40973 1.71569 6.21799 2.09202C6 2.51984 6 3.0799 6 4.2V5M8 10.5V15.5M12 10.5V15.5M1 5H19M17 5V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V5"
                    stroke="#D92D20"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="text-[1.125rem] font-[600] leading-[21.13px]">
                Delete Product(s)
              </h3>
              <p className="text-center text-[0.875rem] leading-[20px]">
                Are you sure you want to delete this product(s)? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex w-[100%] items-center justify-center gap-[0.5rem] text-[0.875rem]">
              <button
                onClick={onClose}
                className="flex h-[44px] flex-1 items-center justify-center rounded-[6.25rem] border-[1px] border-[#D0D5DD] px-[1.25rem] py-[0.875rem]"
              >
                No, cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex h-[44px] flex-1 items-center justify-center rounded-[6.25rem] border-[1px] border-[#D0D5DD] bg-[#D92D20] px-[1.25rem] py-[0.875rem] text-white"
              >
                {deleteBulkProducts.isPending ? (
                  <LoadingComponent />
                ) : (
                  "Yes, Confirm"
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
};

export default BulkDeleteModal;
