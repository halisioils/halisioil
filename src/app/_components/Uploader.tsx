"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useImageContext } from "~/context/ImageFormContext";
import ProgressBar from "~/utils/ProgressBar";

export default function Uploader() {
  const [dragActive, setDragActive] = useState(false);

  const {
    files,
    setFiles,
    progress,
    setIsUploading,
    isUploading,
    setPreviews,
    previews,
  } = useImageContext();

  function reset() {
    setIsUploading(false);
    setFiles([]);
    setPreviews([]);
  }

  function handleFileChange(file: File) {
    toast.dismiss();

    if (file.type.split("/")[0] !== "image") {
      toast.error("We only accept image files");
      return;
    }

    if (file.size / 1024 / 1024 > 4) {
      toast.error("File size too big (max 4MB)");
      return;
    }

    setFiles((fileInput) => [...fileInput, file]);
    setPreviews((prevPreviews) => [...prevPreviews, URL.createObjectURL(file)]);
  }

  function handleDeletePreview(index: number) {
    // Remove the file and preview at the given index
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];

    updatedFiles.splice(index, 1); // Remove file at index
    updatedPreviews.splice(index, 1); // Remove preview at index

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  }

  return (
    <section className="mb-[1rem]">
      <div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 md:h-32"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const files = e.dataTransfer?.files;
              if (files) {
                Array.from(files).forEach((file) => handleFileChange(file));
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md bg-white px-10 opacity-100 transition-all hover:bg-gray-50`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Upload icon</title>
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/jpeg,image/jpg, image/png"
            multiple // Allow multiple files
            className="sr-only"
            onChange={(event) => {
              const selectedFiles = event.currentTarget?.files;
              if (selectedFiles) {
                Array.from(selectedFiles).forEach((file) =>
                  handleFileChange(file),
                );
              }
            }}
          />
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative h-24 w-24 rounded-md">
              {
                // eslint-disable-next-line @next/next/no-img-element -- We want a simple preview here, no <Image> needed
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-full w-full rounded-md object-cover"
                />
              }
              <button
                onClick={() => handleDeletePreview(index)}
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
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {isUploading && <ProgressBar value={progress} />}

        {files.length > 0 && (
          <button
            type="reset"
            onClick={reset}
            disabled={isUploading || files.length === 0}
            className="mt-[1rem] flex h-10 w-full items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-700 transition-all hover:bg-white hover:text-black focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Reset
          </button>
        )}
      </div>
    </section>
  );
}
