import { FaPlus, FaUpload } from "react-icons/fa"
import TreeNode from "./TreeNode";

export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: FileItem[];
  parentId?: string;
  url?: string;
//   content?: string;
};

type SidebarProps = {
    data: FileItem[],
    onCreateFolder: () => void,
}

const Sidebar = ({ data, onCreateFolder }: SidebarProps) => {
  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">My Drive</h2>
       {/* <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 p-2 rounded bg-gray-800 cursor-pointer hover:bg-gray-700 transition"
        >
            <FaPlus /> Create Folder
        </button> */}


      <div className="mt-2">
        {data.map((item) => (
          <TreeNode key={item.id} node={item} />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar