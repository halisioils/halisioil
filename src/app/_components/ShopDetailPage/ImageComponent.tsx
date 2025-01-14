"use client";
import React, { useState } from "react";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { type ImageContent } from "~/lib/types";

const ImageComponent = ({
  imagePaths,
  name,
}: {
  imagePaths: ImageContent[];
  name: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageContent | null>(
    imagePaths[0] ?? null,
  );

  return (
    <div className="flex items-center">
      {/* Thumbnail List */}
      <div className="relative mr-4 flex h-[76px] w-[76px] flex-col overflow-y-auto">
        {imagePaths.map((image, index) => (
          <div key={image.key} className="mb-2">
            <Image
              src={image.url}
              alt={`Thumbnail ${name} ${index + 1}`}
              className={`cursor-pointer rounded-lg border-2 ${
                selectedImage?.key === image.key
                  ? "border-blue-500"
                  : "border-transparent"
              } transition duration-300`}
              onClick={() => setSelectedImage(image)}
              width={76}
              height={76}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative mx-auto h-[158px] w-full rounded-[1rem] md:h-[158px] md:rounded-[0.75rem]">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={`Main image for ${name}`}
            sizes="(min-width: 768px) 100vw, 700px"
            priority
            fill
            style={{
              objectFit: "cover",
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
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="rounded-[1rem]"
          />
        )}
        <div className="carousel-gradient absolute inset-0 rounded-[1rem]"></div>
      </div>
    </div>
  );
};

export default ImageComponent;
