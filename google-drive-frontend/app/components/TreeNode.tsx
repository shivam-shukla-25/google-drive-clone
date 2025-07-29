import { useState } from "react";
import type { FileItem } from "./Sidebar";
import { FaChevronDown, FaChevronRight, FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";

const TreeNode: React.FC<{ node: FileItem }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === "file") {
    return (
      <div className="ml-6 py-1 flex items-center gap-2 text-sm text-gray-300">
        <FaFile /> {node.name}
      </div>
    );
  }

  return (
    <div className="ml-2">
      <div
        className="flex items-center gap-2 cursor-pointer text-white py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        {isOpen ? <FaFolderOpen /> : <FaFolder />}
        <span>{node.name}</span>
      </div>
      {isOpen && (
        <div className="ml-4">
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;