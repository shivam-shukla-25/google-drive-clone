import { FaBars } from "react-icons/fa"
import TreeNode from "./TreeNode";
import { useState, useEffect } from "react";

export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: FileItem[];
  parentId?: string;
  url?: string;
};

type SidebarProps = {
  data: FileItem[],
  hidden?: boolean,
  setHidden?: (hidden: boolean) => void,
}



const Sidebar = ({ data, hidden: externalHidden, setHidden: externalSetHidden }: SidebarProps) => {
  const [internalHidden, setInternalHidden] = useState(false);
  const hidden = externalHidden !== undefined ? externalHidden : internalHidden;
  const setHidden = externalSetHidden || setInternalHidden;


  // Responsive: track screen size for correct sidebar behavior
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1024px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handler = () => {
      setIsLargeScreen(window.matchMedia('(min-width: 1024px)').matches);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Hamburger for small screens
  if (!isLargeScreen && hidden) {
    return (
      <button
        className="lg:hidden block fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded shadow-lg hover:bg-gray-800 focus:outline-none"
        onClick={() => setHidden(false)}
        aria-label="Show sidebar"
      >
        <FaBars size={22} className="cursor-pointer" />
      </button>
    );
  }

  return (
    <aside className="w-64 h-full shadow-2xl bg-gray-900 text-white flex flex-col p-4 overflow-y-auto transition-all duration-300 fixed top-0 left-0 z-40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl ml-4 font-semibold">My Drive</h2>
        {/* Hide button only on < lg screens */}
        <button
          className="lg:hidden block p-2 rounded hover:bg-gray-800 focus:outline-none ml-auto"
          onClick={() => setHidden(true)}
          aria-label="Hide sidebar"
        >
          <FaBars size={20} className="cursor-pointer" />
        </button>
      </div>
      <div className="mt-2">
        {data.map((item) => (
          <TreeNode key={item.id} node={item} />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar