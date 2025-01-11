import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { adminUpdateSchema, type IAdminUpdateSchema } from "~/lib/types";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import toast from "react-hot-toast";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Transform the availability array to match React Select's structure

const permissionOptions = [
  { value: "NORMAL_USER", label: "Normal user" },
  { value: "ADMIN_USER", label: "Admin user" },
  { value: "SUPER_ADMIN", label: "Super admin" },
];

const AdminUpdateFormComponent = () => {
  const utils = api.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const searchParams = useSearchParams();
  const id = searchParams.get("admin_action_id") ?? "";

  const user = api.user.getSingleUser.useSuspenseQuery({ id })[0];

  const router = useRouter();

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IAdminUpdateSchema>({
    resolver: zodResolver(adminUpdateSchema),
  });

  const createAdminUser = api.user.createAdmin.useMutation({
    onSuccess: async (data) => {
      await utils.user.invalidate();
      toast.success(
        `${data.permission} successfully assign ${data.permission} permission`,
      );

      router.back();
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

        if (errorData.permission) {
          setError("permission", {
            type: "manual",
            message: errorData.permission, // Pass the extracted error message
          });
        }
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again.",
        );
      }
    },
  });

  const onSubmit = async (data: IAdminUpdateSchema) => {
    if (user) {
      createAdminUser.mutate({
        email: user.email,
        permission: data.permission,
      });
    }

    reset();
  };

  return (
    <section>
      <BackButton />

      {errorMessage && (
        <p className="my-4 w-full rounded-sm bg-red-100 p-[0.5rem] text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      {user ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Admin email</label>
          <div className="mb-2">
            <p className="flex h-[44px] w-[100%] rounded-[6.25rem] border-[1px] border-[#D0D5DD] px-[1.25rem] py-[0.875rem] text-[0.875rem] text-[#252c32] shadow-sm transition-all duration-75 ease-in-out">
              {user.email}
            </p>
          </div>

          <div className="mb-[1.5rem]">
            <label>Permission</label>

            <Controller
              name="permission" // Field name
              control={control}
              defaultValue={user.permission || ""}
              render={({ field }) => (
                <Select
                  {...field}
                  options={permissionOptions}
                  className="z-30 text-[0.875rem]"
                  placeholder="Select permission"
                  onChange={(selected) => field.onChange(selected?.value)} // Update field value
                  value={permissionOptions.find(
                    (option) => option.value === field.value, // Match current value with option
                  )}
                />
              )}
            />

            {errors.permission?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.permission.message === "string"
                  ? errors.permission.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn-admin ${isSubmitting && "cursor-not-allowed opacity-50"}`}
          >
            {isSubmitting ? <LoadingComponent /> : "Update Permission"}
          </button>
        </form>
      ) : (
        <div className="flex min-h-[20vh] items-center justify-center text-center">
          <p>You currently do not have any registered user.</p>
        </div>
      )}
    </section>
  );
};

const AdminUpdateForm = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <AdminUpdateFormComponent />
    </Suspense>
  );
};

export default AdminUpdateForm;
