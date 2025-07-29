import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
};

const CreateFolderModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [folderName, setFolderName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mb-4"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
