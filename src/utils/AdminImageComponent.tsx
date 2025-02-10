"use client";
import React, { useState } from "react";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { type ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import Uploader from "~/app/_components/Uploader";
import { useUploadThing } from "./uploadthing";
import { useImageContext } from "~/context/ImageFormContext";
import LoadingComponent from "./LoadingComponent";

const AdminImageComponent = ({
  id,
  imagePaths,
  name,
}: {
  id: string;
  imagePaths: ImageContent[];
  name: string;
}) => {
  const utils = api.useUtils();
  const [selectedImage, setSelectedImage] = useState<
    ImageContent | null | undefined
  >(imagePaths[0] ?? null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // General error message

  const {
    setIsUploading,
    isUploading,
    setProgress,
    setPreviews,
    setFiles,
    files,
  } = useImageContext();

  const deleteProductImage = api.product.deleteImage.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      toast.success(`Product - ${data.name} image updated successfully`);
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

        if (errorData.id) {
          toast.error(`${errorData.id}`);
          return;
        }

        if (errorData.images) {
          toast.error(` ${errorData.images}`);
          return;
        }
      } else {
        setErrorMessage(
          error.message ?? "Something went wrong. Please try again.",
        );
      }
    },
  });

  const addMoreProductImage = api.product.addImages.useMutation({
    onSuccess: async (data) => {
      await utils.product.invalidate();
      setFiles([]);
      setPreviews([]);
      setIsUploading(false);
      toast.success(`Product - ${data.name} image updated successfully`);
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

        if (errorData.id) {
          toast.error(`${errorData.id}`);
          return;
        }

        if (errorData.images) {
          toast.error(` ${errorData.images}`);
          return;
        }
      } else {
        setErrorMessage(
          error.message ?? "Something went wrong. Please try again.",
        );
      }
    },
  });

  const handleImageDelete = async () => {
    try {
      if (selectedImage && id) {
        await deleteProductImage.mutateAsync({
          id,
          key: selectedImage.key,
        });

        // Filter out the deleted image
        const remainingImages = imagePaths.filter(
          (image) => image.key !== selectedImage.key,
        );

        if (remainingImages.length > 0) {
          // If there are remaining images, select the first one
          setSelectedImage(remainingImages[0]);
        } else {
          // If no images left, set selectedImage to null
          setSelectedImage(null);
        }
      }
    } catch (error) {
      toast.error("Unknown error occurred");
    }
  };

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

  const handleAddMoreImage = async () => {
    try {
      const imageUploadResult = await startUpload(files); // Upload images before submitting the form

      if (imageUploadResult) {
        const imageShape = imageUploadResult.map((d) => ({
          key: d.key,
          url: d.url,
          size: d.size,
          name: d.name,
        }));

        addMoreProductImage.mutate({
          id,
          images: imageShape,
        });
      }
    } catch (error) {
      toast.error("Unknown error occurred");
    }
  };

  return (
    <section className="h-[100%] w-[100%]">
      {/* Main Image Display */}
      {errorMessage && (
        <p className="my-4 w-full rounded-sm bg-red-100 p-[0.5rem] text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      <div className="relative mx-auto mb-[2rem] h-[350px] w-[100%] rounded-[1rem] border-[1px] border-[#ECECEC] md:w-[300px] md:rounded-[0.75rem] lg:w-[400px]">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={`Main image for ${name}`}
            sizes="(min-width: 768px) 100vw, 700px"
            priority
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className="rounded-[1rem]"
          />
        ) : (
          <Image
            src={image_skeleton}
            alt={`Placeholder image for ${name}`}
            sizes="(min-width: 768px) 100vw, 700px"
            priority
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className="rounded-[1rem]"
          />
        )}
        {/* Only allow delete if there is more than one image */}
        {imagePaths.length > 1 && (
          <button
            onClick={handleImageDelete}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-500 p-2 text-white"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail List */}
      <div className="flex flex-wrap items-center justify-center gap-[1rem]">
        {imagePaths.map((image, index) => (
          <div key={image.key} className="relative mb-2 h-[76px] w-[76px]">
            <Image
              src={image.url}
              alt={`Thumbnail ${name} ${index + 1}`}
              className={`cursor-pointer rounded-lg border-[1px] ${
                selectedImage?.key === image.key
                  ? "border-[#B88E2F]"
                  : "border-[#ECECEC]"
              } transition duration-300`}
              onClick={() => setSelectedImage(image)}
              sizes="(min-width: 768px) 50vw, 100vw"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <Uploader />
        <button
          onClick={handleAddMoreImage}
          disabled={isUploading}
          className="mt-[1rem] flex h-10 w-full items-center justify-center rounded-md border border-gray-200 bg-[#B88E2F] text-sm text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {isUploading ? <LoadingComponent /> : "Add More"}
        </button>
      </div>
    </section>
  );
};

export default AdminImageComponent;
