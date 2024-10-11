"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
}: FileUploadProps) => {
  
  // Log value to check if it is being updated correctly
  console.log("Current value:", value);

  // Extract file extension
  const fileType = value?.split(".").pop()?.toLowerCase();

  // Log fileType to verify the file type
  console.log("File type:", fileType);

  // Check if the file is not a PDF and display the image
  if (value && fileType !== "pdf") {
    console.log("Rendering image with file type:", fileType);
    return (
      <div className="relative h-20 w-20 rounded-full overflow-hidden">
        {/* Use next/image to display the uploaded image */}
        <Image
          src={value} // Ensure value is the correct image URL
          alt="Upload"
          fill
          className="object-cover rounded-full"
        />
        {/* Button to clear the image */}
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // If no image is uploaded, show the UploadDropzone for file upload
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("Upload complete:", res);
        if (res && res.length > 0) {
          // Update the image URL by calling onChange with the URL of the uploaded file
          onChange(res?.[0].url);
        } else {
          console.error("Upload response is empty:", res);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
    />
  );
};
