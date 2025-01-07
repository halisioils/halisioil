import Select from "react-select";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { productSchema } from "~/lib/types";
import { useState } from "react";
import Uploader from "../Uploader";
import { useImageContext } from "~/context/ImageFormContext";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";

const availability = [true, false];

// Define the type for the image object
interface Image {
  id: number;
  link: string;
}

const ProductForm = () => {
  const [categories, isPending] =
    api.category.getAllCategories.useSuspenseQuery();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const {
    setIsUploading,
    setProgress,
    files,
    setFiles,
    previews,
    setPreviews,
  } = useImageContext();

  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    reset();
  };

  console.log(errors);

  // Transform the array to match React Select's structure
  const categoryOptions = categories.map((category) => ({
    value: category.id, // Set value to the category ID
    label: capitalizeFirstLetter(category.name), // Set label to the category name
  }));

  // Transform the availability array to match React Select's structure
  const availabilityOptions = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  const uploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);

    const newImageFile = e.target.files?.[0];
    if (newImageFile) {
      const newImageData: Image = {
        id: Date.now(), // Generate a unique ID for the image
        link: URL.createObjectURL(newImageFile), // Generate a temporary URL for the uploaded image
      };
      setImages((prevImages) => [...prevImages, newImageData]);
    }
  };

  const updateImagesOrder = (newImages: Image[]) => {
    setImages(newImages);
  };

  return (
    <section>
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[1rem]">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            {...register("name", { required: "Product name is required" })}
          />
          {errors.name && (
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
          {errors.description && (
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
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.price.message === "string"
                ? errors.price.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-[1rem]">
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

          {errors.categoryIds && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.categoryIds.message === "string"
                ? errors.categoryIds.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium"> Upload images</label>
          <Uploader />
          {errors.imagePaths && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.imagePaths.message === "string"
                ? errors.imagePaths.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-[1rem]">
          <label>Is Available</label>

          <Controller
            name="isAvailable" // Field name
            control={control}
            defaultValue={{ isAvailable: true }} // Default to an true
            render={({ field }) => (
              <Select
                {...field}
                options={availabilityOptions} // True/False options
                className="z-30 text-[0.875rem]"
                placeholder="Select availability"
                onChange={(selected) => field.onChange(selected?.value)} // Extract value
                value={availabilityOptions.find(
                  (option) => option.value === field.value,
                )} // Map value back to option
              />
            )}
          />
          {errors.isAvailable && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.isAvailable.message === "string"
                ? errors.isAvailable.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`btn-primary ${isSubmitting && "cursor-not-allowed opacity-50"}`}
        >
          {isSubmitting ? <LoadingComponent /> : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default ProductForm;
