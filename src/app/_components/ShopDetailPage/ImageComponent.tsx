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
    <section className="h-[100%] w-[100%] flex-col items-center justify-center gap-[1rem]">
      {/* Main Image Display */}
      <div className="relative mx-auto mb-[2rem] h-[350px] w-[100%] rounded-[1rem] border-[1px] border-[#ECECEC] md:rounded-[0.75rem]">
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
                  ? "border-orange-500"
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
    </section>
  );
};

export default ImageComponent;
