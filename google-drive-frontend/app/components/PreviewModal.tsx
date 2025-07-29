import { useEffect, useState, useRef } from "react";
import { useAuth } from "~/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  url?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
};

export default function PreviewModal({ isOpen, onClose, file }: Props) {
  const [textContent, setTextContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const { token } = useAuth();
  const lastBlobUrl = useRef<string>("");

  useEffect(() => {
    setTextContent("");
    setImageUrl("");
    if (!file || file.type !== "file" || !file.id || !file.name) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const isText =
      extension &&
      ["txt", "md", "js", "ts", "jsx", "tsx", "json", "html", "css"].includes(extension);
    const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension || "");
    const previewUrl = `${API_URL}/files/preview/${file.id}`;

    if (isText) {
      fetch(previewUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.text())
        .then((text) => setTextContent(text))
        .catch(() => setTextContent("Failed to load file."));
    } else if (isImage) {
      fetch(previewUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.blob())
        .then((blob) => {
          if (lastBlobUrl.current) URL.revokeObjectURL(lastBlobUrl.current);
          const url = URL.createObjectURL(blob);
          lastBlobUrl.current = url;
          setImageUrl(url);
        })
        .catch(() => setImageUrl(""));
    }
    // Cleanup blob url on unmount or file change
    return () => {
      if (lastBlobUrl.current) {
        URL.revokeObjectURL(lastBlobUrl.current);
        lastBlobUrl.current = "";
      }
    };
  }, [file?.id, file?.name, token]);

  if (!isOpen || !file || file.type !== "file" || !file.name) return null;

  const extension = file.name.split(".").pop()?.toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension || "");
  const isText =
    extension &&
    ["txt", "md", "js", "ts", "jsx", "tsx", "json", "html", "css"].includes(extension);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Preview: {file.name}</h2>

        <div className="w-full">
          {isImage ? (
            imageUrl ? (
              <img
                src={imageUrl}
                alt={file.name}
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />
            ) : (
              <div className="text-gray-600">Loading image...</div>
            )
          ) : isText ? (
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap overflow-auto max-h-[400px]">
              {textContent || "Loading..."}
            </pre>
          ) : (
            <div className="text-gray-600">Cannot preview this file type.</div>
          )}
        </div>
      </div>
    </div>
  );
}
