import { type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { categorySchema, ICategorySchema } from "~/lib/types";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import toast from "react-hot-toast";
import { useState } from "react";

const CategoryForm = () => {
  const utils = api.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  const createCategory = api.category.create.useMutation({
    onSuccess: async (data) => {
      await utils.category.invalidate();
      toast.success(`Category - ${data.name} added successfully`);
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
          setError("name", {
            type: "manual",
            message: errorData.email, // Pass the extracted error message
          });
        }
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again.",
        );
      }
    },
  });

  const onSubmit = async (data: ICategorySchema) => {
    createCategory.mutate({
      name: data.name,
    });
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
        <label>Category Name</label>
        <div className="mb-2 mt-4 flex flex-wrap items-center gap-[1rem]">
          <input
            type="text"
            placeholder="Enter category name"
            {...register("name")}
            className="flex-1"
          />
          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn-admin ${isSubmitting && "cursor-not-allowed opacity-50"}`}
          >
            {isSubmitting ? <LoadingComponent /> : "Create"}
          </button>
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {typeof errors.name.message === "string"
              ? errors.name.message
              : "Invalid input"}
          </p>
        )}
      </form>
    </section>
  );
};

export default CategoryForm;
