import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { type IUserSchema, userSchema } from "~/lib/types";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import toast from "react-hot-toast";
import { useState } from "react";
import Skeleton from "~/utils/Skeleton";

// Transform the availability array to match React Select's structure

const permissionOptions = [
  { value: "NORMAL_USER", label: "Normal user" },
  { value: "ADMIN_USER", label: "Admin user" },
  { value: "SUPER_ADMIN", label: "Super admin" },
];

const AdminForm = () => {
  const utils = api.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const adminUsers = api.user.getAdminUsers.useQuery();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IUserSchema>({
    resolver: zodResolver(userSchema),
  });

  const createAdminUser = api.user.createAdmin.useMutation({
    onSuccess: async (data) => {
      await utils.user.invalidate();
      toast.success(
        `${data.permission} successfully assign ${data.permission} permission`,
      );
      reset();
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

        if (errorData.name) {
          setError("email", {
            type: "manual",
            message: errorData.email, // Pass the extracted error message
          });
        }

        if (errorData.name) {
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

  const onSubmit = async (data: IUserSchema) => {
    // createAdminUser.mutate({
    //   email: data.email,
    //   permission: data.permission
    // });

    console.log(data);
  };

  return (
    <section>
      <BackButton />
      {errorMessage && (
        <p className="my-4 w-full rounded-sm bg-red-100 p-[0.5rem] text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      {adminUsers.isLoading && <LoadingComponent />}
      {adminUsers && adminUsers.data && adminUsers.data.length > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Admin email</label>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Enter Email address"
              {...register("email")}
              className="flex-1 rounded-full"
            />
            <Controller
              name="email" // Field name
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={adminUsers.data?.map((user) => ({
                    value: user.email,
                    label: user.email,
                  }))} // Map adminUsers.data to the correct format
                  className="z-30 text-[0.875rem]"
                  placeholder="Select Email"
                  onChange={(selected) => field.onChange(selected?.value)} // Extract value
                  value={adminUsers.data
                    ?.map((user) => ({ value: user.email, label: user.email }))
                    .find((option) => option.value === field.value)} // Map value back to option
                />
              )}
            />
          </div>
          {errors.email?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.email.message === "string"
                ? errors.email.message
                : "Invalid input"}
            </p>
          )}
          <div className="mb-[1.5rem]">
            <label>Permission</label>

            <Controller
              name="permission" // Field name
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={permissionOptions} // True/False options
                  className="z-30 text-[0.875rem]"
                  placeholder="Select permission"
                  onChange={(selected) => field.onChange(selected?.value)} // Extract value
                  value={permissionOptions.find(
                    (option) => option.value === field.value,
                  )}
                  // Map value back to option
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
            {isSubmitting ? <LoadingComponent /> : "Add admin"}
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

export default AdminForm;
