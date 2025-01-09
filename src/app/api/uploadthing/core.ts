import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { type KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const { getUser } = getKindeServerSession();

const f = createUploadthing();

class CustomUploadThingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomUploadThingError";
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user: KindeUser = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new CustomUploadThingError("Unauthorized");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { key: file.key, url: file.url, size: file.size, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
