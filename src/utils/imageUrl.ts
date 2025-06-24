// const backendUrl = "http://localhost:3001";
const backendUrl = "https://api.myngo.my";

export const getImageUrl = (imagePath: string): string => {
  // If imagePath already includes the backend URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If imagePath starts with /, remove it to avoid double slashes
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  return `${backendUrl}/${cleanPath}`;
};

export const getBusinessImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath);
};
