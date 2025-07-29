import React, { useState } from "react";
import { type FileItem } from "./Sidebar";
import { FaFolder, FaFile, FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  items: FileItem[];
  onFolderClick: (id: string) => void;
  onFileClick?: (file: FileItem) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
};

const DriveContent: React.FC<Props> = ({ items, onFolderClick, onFileClick, onRename, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");


  if (items.length === 0) {
    return (
      <div className="text-gray-500 text-2xl text-center py-12">
        📂 This folder is empty
      </div>
    );
  }


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded shadow p-4 relative group"
        >
          <div
            className="cursor-pointer"
            onClick={() => item.type === "folder" ? onFolderClick(item.id) : onFileClick?.(item)}
          >
            {item.type === "folder" ? (
              <FaFolder className="text-yellow-500 mb-2" />
            ) : (
              <FaFile className="text-gray-600 mb-2" />
            )}
            {editingId === item.id ? (
              <input
                className="w-full border p-1"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  onRename(item.id, tempName.trim());
                  setEditingId(null);
                }}
                autoFocus
              />
            ) : (
              <p className="truncate">{item.name}</p>
            )}
          </div>

          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button onClick={() => { setEditingId(item.id); setTempName(item.name); }}>
              <FaEdit className="text-blue-600" />
            </button>
            <button onClick={() => onDelete(item.id)}>
              <FaTrash className="text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriveContent;
