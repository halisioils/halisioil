import { type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactSortable } from "react-sortablejs";
import { api } from "~/trpc/react";
import { productSchema } from "~/lib/types";
import { useState } from "react";
import Uploader from "../Uploader";
import { useImageContext } from "~/context/ImageFormContext";
import BackButton from "~/utils/BackButton";
import LoadingComponent from "~/utils/LoadingComponent";

const availability = [true, false];

// Define the type for the image object
interface Image {
  id: number;
  link: string;
}

const ProductForm = () => {
  const [images, setImages] = useState<Image[]>([]);

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

  console.log(images);

  return (
    <section>
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
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

        <div className="mb-2">
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

        <div className="mb-2">
          <label>Price (in Pounds)</label>
          <input
            type="number"
            placeholder="Enter price"
            {...register("price")}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.price.message === "string"
                ? errors.price.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-2">
          <label>Category</label>
          <select {...register("category")}>
            <option value="">Select a category</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
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

        <div className="mb-2">
          <label>Is Available</label>
          <select {...register("isAvailable")}>
            <option disabled selected>
              Select availability
            </option>
            {availability.map((status, index) => (
              <option key={index} value={status.toString()}>
                {status ? "Available" : "Unavailable"}
              </option>
            ))}
          </select>
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
