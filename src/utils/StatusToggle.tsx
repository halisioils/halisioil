"use client";
import React, { Suspense } from "react";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import { statusStyles } from "~/utils/utilityStyles";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useOrderDropdown } from "~/hooks/useDropdown";
import LoadingComponent from "./LoadingComponent";

const StatusToggleComponent = ({
  id,
  selectedStatus,
  onStatusChange,
}: {
  id: string;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}) => {
  const utils = api.useUtils();

  const { isDropdownVisible, setIsDropdownVisible, dropdownRef } =
    useOrderDropdown();

  const updateStatus = api.order.updateOrder.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      toast.success(`Order updated to ${data.status}`);
      onStatusChange(data.status); // Lift status change up to parent
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

        if (errorData.status) {
          toast.error(errorData.status);
        }
      } else {
        toast.error(error.message ?? "Something went wrong. Please try again.");
      }
    },
  });

  const onSubmit = (status: string) => {
    updateStatus.mutate({
      id,
      status,
    });
    setIsDropdownVisible(false); // Close the dropdown after selecting a status
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <p
        className={`my-[0.5rem] flex h-fit cursor-pointer items-center justify-between truncate rounded-[5rem] px-[1rem] py-[0.2rem] text-left text-[0.875rem] font-[400] ${statusStyles(
          selectedStatus,
        )}`}
        onClick={() => setIsDropdownVisible((prev) => !prev)} // Toggle dropdown visibility on click
      >
        {capitalizeFirstLetter(selectedStatus).replace("_", " ")}
        <span>
          <svg
            width="9"
            height="5"
            viewBox="0 0 9 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              stroke:
                selectedStatus.toLowerCase() === "cancelled"
                  ? "#AC0F05"
                  : selectedStatus.toLowerCase() === "pending"
                    ? "#BC8A09"
                    : selectedStatus.toLowerCase() === "delivered"
                      ? "#0D875A"
                      : selectedStatus.toLowerCase() === "shipped"
                        ? "#0077B6"
                        : "#000000", // default black
            }}
          >
            <path
              d="M4.1207 4.93856C4.02216 4.93903 3.92452 4.91981 3.8335 4.88203C3.74249 4.84425 3.65994 4.78867 3.5907 4.71856L0.120696 1.21856C0.0293057 1.07761 -0.0121153 0.910047 0.00307221 0.742743C0.0182597 0.575439 0.0891765 0.418079 0.204456 0.295883C0.319735 0.173687 0.472701 0.0937313 0.638837 0.0688319C0.804973 0.0439326 0.974659 0.0755315 1.1207 0.158563L4.1207 3.15856L7.1207 0.158563C7.26673 0.0755315 7.43642 0.0439326 7.60256 0.0688319C7.76869 0.0937313 7.92166 0.173687 8.03694 0.295883C8.15222 0.418079 8.22313 0.575439 8.23832 0.742743C8.25351 0.910047 8.21209 1.07761 8.1207 1.21856L4.6207 4.71856C4.48819 4.85298 4.30932 4.93168 4.1207 4.93856Z"
              fill="#AC0F05"
            />
          </svg>
        </span>
      </p>

      {/* Dropdown */}
      {isDropdownVisible && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg">
          <ul>
            {["pending", "shipped", "delivered", "cancelled"].map((status) => (
              <li
                key={status}
                className="cursor-pointer p-2 text-[0.875rem] hover:bg-gray-200"
                onClick={() => onSubmit(status)}
              >
                {capitalizeFirstLetter(status.replace("_", " "))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatusToggle = ({
  id,
  selectedStatus,
  onStatusChange,
}: {
  id: string;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}) => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <StatusToggleComponent
        id={id}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
      />
    </Suspense>
  );
};

export default StatusToggle;
