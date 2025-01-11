import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingComponent from "~/utils/LoadingComponent";
import AdminForm from "./AdminForm";
import AdminsTable from "~/utils/AdminsTable";
import AdminUpdateForm from "./AdminUpdateForm";

const AdminsComponent = () => {
  const searchParams = useSearchParams();
  const active_section = searchParams.get("admin_action");

  const page = parseInt(searchParams.get("page") ?? "1", 10); // Ensure page is a number
  const per_page = 10;

  const pathname = usePathname();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  // Function to render the component based on `toggled url state`
  const renderComponent = () => {
    switch (active_section) {
      case "create":
        return <AdminForm />;
      case "update":
        return <AdminUpdateForm />;
      default:
        return (
          <div>
            <button
              onClick={() => updateQueryParams("admin_action", "create")}
              className="flex items-center gap-[1rem] rounded-full bg-[#0D2F3F] px-[1rem] py-2 text-white"
              type="button"
            >
              Add Admin
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>

            <AdminsTable page={page} per_page={per_page} />
          </div>
        );
    }
  };

  return <section>{renderComponent()}</section>;
};

const Admins = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <AdminsComponent />
    </Suspense>
  );
};

export default Admins;
