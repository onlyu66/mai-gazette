export const extractStoragePathFromUrl = (
  imageUrl: string,
): { bucket: string; objectPath: string } | null => {
  try {
    const parsedUrl = new URL(imageUrl);
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");

    const storageMatch = normalizedPath.match(
      /^\/storage\/v1\/object\/([^/]+)\/([^/]+)\/(.+)$/,
    );

    if (storageMatch) {
      const [, accessType, bucket, objectPath] = storageMatch;
      if (accessType === "public") {
        return { bucket, objectPath: decodeURIComponent(objectPath) };
      }
    }

    const publicMatch = normalizedPath.match(/\/public\/([^/]+)\/(.+)$/);
    if (publicMatch) {
      const [, bucket, objectPath] = publicMatch;
      return { bucket, objectPath: decodeURIComponent(objectPath) };
    }

    return null;
  } catch {
    return null;
  }
};
