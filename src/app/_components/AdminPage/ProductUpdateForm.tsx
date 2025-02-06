import Select from "react-select";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { clientProductSchema, type IProductUpdateSchema } from "~/lib/types";
import { Suspense, useMemo, useState } from "react";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import MultiInput from "~/utils/MultiInput";
import Skeleton from "~/utils/Skeleton";
import { useProductUpdate } from "~/hooks/useProductUpdate";

const ProductUpdateFormComponent = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const searchParams = useSearchParams();
  const id = searchParams.get("product_action_id") ?? "";

  const product = api.product.getSingleProduct.useSuspenseQuery({ id })[0];
  const categories = api.category.getAllCategories.useSuspenseQuery()[0];

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  // Memoize category IDs to avoid unnecessary changes
  const categoryData = useMemo(
    () =>
      product
        ? product.productCategories.map((d) => ({
            categoryId: d.categoryId,
            price: Number(d.price),
          }))
        : [],
    [product],
  );

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(clientProductSchema),
  });

  const { selectedCategories, setSelectedCategories, handlePriceChange } =
    useProductUpdate(categoryData, setValue);

  const createProduct = api.product.update.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      toast.success(`Product - ${data.name} updated successfully`);
      reset();
      setSelectedCategories([]);
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

        if (errorData.description) {
          setError("description", {
            type: "manual",
            message: errorData.description, // Pass the extracted error message
          });
        }

        if (errorData.price) {
          setError("price", {
            type: "manual",
            message: errorData.price, // Pass the extracted error message
          });
        }

        if (errorData.categoryIds) {
          setError("categoryIds", {
            type: "manual",
            message: errorData.categoryIds, // Pass the extracted error message
          });
        }

        if (errorData.imagePaths) {
          setError("imagePaths", {
            type: "manual",
            message: errorData.imagePaths, // Pass the extracted error message
          });
        }

        if (errorData.status) {
          setError("status", {
            type: "manual",
            message: errorData.status, // Pass the extracted error message
          });
        }
      } else {
        setErrorMessage(
          error.message ?? "Something went wrong. Please try again.",
        );
      }
    },
  });

  // Transform the array to match React Select's structure
  const categoryOptions =
    categories.map((category) => ({
      value: category.id,
      label: capitalizeFirstLetter(category.name),
    })) ?? [];

  // Transform the availability array to match React Select's structure
  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "SOLD_OUT", label: "Sold Out" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "COMING_SOON", label: "Coming Soon" },
  ];

  const onSubmit = async (dataValue: FieldValues) => {
    try {
      if (product) {
        const data = dataValue as IProductUpdateSchema;

        createProduct.mutate({
          id: product.id,
          name: data.name,
          description: data.description,
          categories: data.categories,
          properties: data.properties,
          status: data.status,
        });
      }
    } catch (error) {
      toast(`Unknown error occured`);
    }
  };

  return (
    <section className="mb-[2rem]">
      <BackButton />
      {errorMessage && (
        <p className="my-4 w-full rounded-sm bg-red-100 p-[0.5rem] text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      {product ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-[1rem]">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              defaultValue={product.name || ""}
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.name.message === "string"
                  ? errors.name.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <div className="mb-[1rem]">
            <label>Description</label>
            <textarea
              placeholder="Enter product description"
              defaultValue={product.description || ""}
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.description.message === "string"
                  ? errors.description.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <div className="mb-[1.5rem]">
            <label>Category</label>
            <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categoryOptions}
                  isMulti
                  placeholder="Select categories"
                  value={categoryOptions.filter((option) =>
                    selectedCategories.some(
                      (sc) => sc.categoryId === option.value,
                    ),
                  )}
                  onChange={(selected) => {
                    const updatedCategories = selected.map((option) => {
                      const existingCategory = selectedCategories.find(
                        (c) => c.categoryId === option.value,
                      );
                      return {
                        categoryId: option.value,
                        price: existingCategory ? existingCategory.price : 0, // Preserve existing price if available
                      };
                    });

                    setSelectedCategories(updatedCategories);
                    field.onChange(updatedCategories);
                  }}
                />
              )}
            />

            {errors.productCategories?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.productCategories.message === "string"
                  ? errors.productCategories.message
                  : "Invalid input"}
              </p>
            )}
            {selectedCategories.map(({ categoryId, price }) => {
              const categoryLabel =
                categoryOptions.find((option) => option.value === categoryId)
                  ?.label ?? "Unknown Category";

              return (
                <div key={categoryId} className="mt-[1.5rem]">
                  <label>Price (in Pounds) - {categoryLabel}</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      handlePriceChange(categoryId, Number(e.target.value))
                    }
                    placeholder="Enter price"
                    required
                  />
                </div>
              );
            })}
          </div>

          <div className="mb-[1.5rem]">
            <label>Properties</label>
            <Controller
              name="properties"
              control={control}
              defaultValue={product.properties || ""}
              render={({ field }) => (
                <MultiInput
                  value={field.value as string[]}
                  onChange={field.onChange} // Type-safe onChange
                />
              )}
            />

            {errors.properties?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.properties.message === "string"
                  ? errors.properties.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <div className="mb-[1.5rem]">
            <label>Is Available</label>

            <Controller
              name="status" // Field name
              control={control}
              defaultValue={product.status || ""}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statusOptions} // True/False options
                  className="z-30 text-[0.875rem]"
                  placeholder="Select availability"
                  onChange={(selected) => field.onChange(selected?.value)} // Extract value
                  value={statusOptions.find(
                    (option) => option.value === field.value,
                  )}
                  // Map value back to option
                />
              )}
            />
            {errors.status?.message && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.status.message === "string"
                  ? errors.status.message
                  : "Invalid input"}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn-primary ${isSubmitting && "cursor-not-allowed"}`}
          >
            {isSubmitting ? <LoadingComponent /> : "Submit"}
          </button>
        </form>
      ) : (
        <Skeleton />
      )}
    </section>
  );
};

const ProductUpdateForm = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ProductUpdateFormComponent />
    </Suspense>
  );
};

export default ProductUpdateForm;
