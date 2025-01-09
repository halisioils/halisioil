import { type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { IUserSchema, userSchema } from "~/lib/types";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import { useState } from "react";

const AdminForm = () => {
  const utils = api.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserSchema>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: IUserSchema) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="">Add new admin</p>
        <div className="mb-2 mt-4 flex flex-wrap items-center gap-[1rem]">
          <input
            type="text"
            placeholder="Enter user email"
            {...register("email")}
            className="flex-1"
          />
          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn-admin ${isSubmitting && "cursor-not-allowed opacity-50"}`}
          >
            {isSubmitting ? <LoadingComponent /> : "Add"}
          </button>
        </div>

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {typeof errors.email.message === "string"
              ? errors.email.message
              : "Invalid input"}
          </p>
        )}
      </form>
    </section>
  );
};

export default AdminForm;
