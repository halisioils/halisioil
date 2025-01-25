import Select from "react-select";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { clientProductSchema, type IProductSchema } from "~/lib/types";
import { useState } from "react";
import Uploader from "../Uploader";
import { useImageContext } from "~/context/ImageFormContext";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import toast from "react-hot-toast";
import { useUploadThing } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import MultiInput from "~/utils/MultiInput";

const ProductForm = () => {
  const categories = api.category.getAllCategories.useSuspenseQuery()[0];

  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const {
    setIsUploading,
    isUploading,
    setProgress,
    setPreviews,
    setFiles,
    files,
  } = useImageContext();

  const router = useRouter();

  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(clientProductSchema),
  });

  const createProduct = api.product.create.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      toast.success(`Product - ${data.name} added successfully`);
      reset();
      setSelectedOption([]);
      setFiles([]);
      setPreviews([]);
      setIsUploading(false);
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

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      setProgress(100);
    },
    onUploadError: (e) => {
      toast.error(e.message);
      return;
    },
    onUploadBegin: () => {
      setIsUploading(true);
      setProgress(50);
    },
  });

  const onSubmit = async (dataValue: FieldValues) => {
    try {
      const imageUploadResult = await startUpload(files); // Upload images before submitting the form

      if (imageUploadResult) {
        const imageShape = imageUploadResult.map((d) => ({
          key: d.key,
          url: d.url,
          size: d.size,
          name: d.name,
        }));

        const data = dataValue as IProductSchema;

        createProduct.mutate({
          name: data.name,
          description: data.description,
          price: data.price,
          categoryIds: data.categoryIds,
          imagePaths: imageShape,
          properties: data.properties,
          status: data.status,
        });
      }
    } catch (error) {
      toast(`Unknown error occured`);
    } finally {
      setIsUploading(true);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[1rem]">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
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

        <div className="mb-[1rem]">
          <label>Price (in Pounds)</label>
          <input
            type="number"
            placeholder="Enter price"
            {...register("price", {
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Price must be positve",
              },
            })}
          />
          {errors.price?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.price.message === "string"
                ? errors.price.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-[1.5rem]">
          <label>Category</label>

          <Controller
            name="categoryIds"
            control={control}
            defaultValue={[]} // Default to an empty array
            render={({ field }) => (
              <Select
                {...selectedOption}
                options={categoryOptions} // Ensure this has valid `value` and `label`
                isMulti
                className="z-30 text-[0.875rem]"
                placeholder="Select categories"
                onChange={(selected) => {
                  const ids = selected.map(
                    (option: { value: string }) => option.value,
                  ); // Extract IDs
                  const values = selected.map((option) => option.label); // Extract IDs
                  setSelectedOption(values);
                  field.onChange(ids); // Update the form state
                }}
              />
            )}
          />

          {errors.categoryIds?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.categoryIds.message === "string"
                ? errors.categoryIds.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-[1.5rem]">
          <label>Properties</label>
          <Controller
            name="properties"
            control={control}
            defaultValue={[]} // Default to an empty array
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
            defaultValue={{ status: "AVAILABLE" }} // Default to an true
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

        <div>
          <label className="block font-medium"> Upload images</label>
          <Uploader />
          {errors.imagePaths?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.imagePaths.message === "string"
                ? errors.imagePaths.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`btn-primary ${isSubmitting && "cursor-not-allowed"}`}
        >
          {isSubmitting || isUploading ? <LoadingComponent /> : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default ProductForm;
