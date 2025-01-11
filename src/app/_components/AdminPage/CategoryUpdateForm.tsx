import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import {
  categoryUpdateFormSchema,
  type ICategoryUpdateSchema,
} from "~/lib/types";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import toast from "react-hot-toast";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "~/utils/Skeleton";

// Transform the availability array to match React Select's structure

const CategoryUpdateFormComponent = () => {
  const utils = api.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const searchParams = useSearchParams();
  const id = searchParams.get("category_action_id") ?? "";

  const category = api.category.getSingleCategory.useSuspenseQuery({ id })[0];

  const router = useRouter();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ICategoryUpdateSchema>({
    resolver: zodResolver(categoryUpdateFormSchema),
  });

  const updateCategory = api.category.update.useMutation({
    onSuccess: async (data) => {
      await utils.category.invalidate();
      toast.success(`${data.name} successfully updated`);

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

        if (errorData.name) {
          setError("name", {
            type: "manual",
            message: errorData.name, // Pass the extracted error message
          });
        }
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again.",
        );
      }
    },
  });

  const onSubmit = async (data: ICategoryUpdateSchema) => {
    if (category) {
      updateCategory.mutate({
        id: id,
        name: data.name,
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

      {category ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-[1.5rem]">
            <label>Category</label>

            <input
              type="text"
              defaultValue={category.name || ""}
              placeholder="Enter category name"
              {...register("name", { required: "Category name is required" })}
            />
            {errors.name?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.name.message === "string"
                  ? errors.name.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn-admin ${isSubmitting && "cursor-not-allowed opacity-50"}`}
          >
            {isSubmitting ? <LoadingComponent /> : "Update Category"}
          </button>
        </form>
      ) : (
        <Skeleton />
      )}
    </section>
  );
};

const CategoryUpdateForm = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <CategoryUpdateFormComponent />
    </Suspense>
  );
};

export default CategoryUpdateForm;
