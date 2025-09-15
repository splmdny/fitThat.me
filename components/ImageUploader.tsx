import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  title: string;
  aspectRatio?: string; // e.g., 'aspect-square', 'aspect-[3/4]'
}

const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      resolve({ base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, aspectRatio = 'aspect-square' }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setPreviewUrl(URL.createObjectURL(file));
        onImageUpload(base64, mimeType);
      } catch (error) {
        console.error("Error converting file to base64", error);
        // Handle error (e.g., show a notification)
      }
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed border-zinc-600 rounded-xl flex items-center justify-center text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300 cursor-pointer group bg-zinc-800/50 ${aspectRatio}`}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
            <span className="text-white text-lg font-semibold">Change Image</span>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 font-semibold">{title}</p>
        </div>
      )}
    </div>
  );
};