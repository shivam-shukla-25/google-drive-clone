import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
};

const UploadFileModal: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a File
          </label>
          <input
            type="file"
            onChange={handleFileInput}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-700">Selected File:</div>
            <div className="text-sm text-gray-600">{selectedFile.name}</div>
            <div className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;