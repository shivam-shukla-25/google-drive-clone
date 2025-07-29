import type { Route } from "./+types/home";
import Sidebar, { type FileItem } from "~/components/Sidebar";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CreateFolderModal from "~/components/CreateFolderModal";
import DriveContent from "~/components/DriveContent";
import { FaPlus, FaUpload } from "react-icons/fa";
import UploadImageModal from "~/components/UploadImageModal";
import PreviewModal from "~/components/PreviewModal";
import { useAuth } from "~/context/AuthContext";
import {
  fetchFolders,
  createFolder,
  renameFolder,
  deleteFolder,
} from "~/services/folderService";
import { uploadFile } from "~/services/fileService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Drive Clone" },
    { name: "description", content: "Welcome to Drive Clone!" },
  ];
}


export default function Home() {
  const { token, user } = useAuth();
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  // Utility: build a tree from a flat folder list
  // Accepts both folders and files, merges them, and builds a tree
  function buildFolderTree(folders: FileItem[], files: FileItem[] = []): FileItem[] {
    const allItems = [...folders, ...files];
    const map = new Map<string, FileItem & { children?: FileItem[] }>();
    const roots: (FileItem & { children?: FileItem[] })[] = [];

    // Add all folders to the map with children array
    allItems.forEach((item) => {
      if (item.type === "folder") {
        map.set(item.id, { ...item, children: item.children || [] });
      }
    });

    // Add all files to the map (no children array)
    allItems.forEach((item) => {
      if (item.type === "file") {
        map.set(item.id, { ...item });
      }
    });

    // Attach children (folders and files) to their parent folder
    allItems.forEach((item) => {
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent && parent.type === "folder") {
          parent.children = parent.children || [];
          parent.children.push(map.get(item.id)!);
        }
      }
    });

    // Only push items with no parentId to roots
    allItems.forEach((item) => {
      if (!item.parentId) {
        roots.push(map.get(item.id)!);
      }
    });

    return roots;
  }


  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const folderData = await fetchFolders(token);
        const { listFiles } = await import("~/services/fileService");

        // Normalize folders
        const normalizedFolders = folderData.map((item: any) => {
          const { children, ...rest } = item;
          if (rest.type === 'folder') return rest;
          if (Array.isArray(item.files)) return { ...rest, type: 'folder' };
          return null;
        }).filter(Boolean);

        // Recursively fetch files for all folders and root
        let allFiles: FileItem[] = [];
        // Files in root
        const rootFiles = await listFiles(null, token);
        if (Array.isArray(rootFiles)) {
          allFiles = allFiles.concat(rootFiles.map((item: any) => ({
            ...item,
            type: 'file',
            parentId: item.folderId || null,
          })));
        }
        // Files in each folder
        for (const folder of normalizedFolders) {
          const files = await listFiles(folder.id, token);
          if (Array.isArray(files)) {
            allFiles = allFiles.concat(files.map((item: any) => ({
              ...item,
              type: 'file',
              parentId: item.folderId || folder.id,
            })));
          }
        }

        setFolders(buildFolderTree(normalizedFolders, allFiles));
        console.log("Folders and files loaded:", normalizedFolders, allFiles);
      } catch (err) {
        console.error("Could not load folders/files", err);
      }
    };

    load();
  }, [token]);


  const handleUploadImage = async (file: File) => {
    try {
      const parentId = currentPath.at(-1) || null;
      const uploadedFile = await uploadFile(file, parentId, token);

      if (!uploadedFile) {
        // If backend returns 204, reload folders from backend
        const data = await fetchFolders(token);
        const normalized = data.map((item: any) => {
          const { children, ...rest } = item;
          if (rest.type === 'folder' || rest.type === 'file') {
            return rest;
          }
          if (Array.isArray(item.files)) {
            return { ...rest, type: 'folder' };
          }
          return { ...rest, type: 'file' };
        });
        setFolders(buildFolderTree(normalized));
        setShowUploadModal(false);
        return;
      }

      const newFile: FileItem = {
        id: uploadedFile.id,
        name: uploadedFile.name,
        type: "file",
        url: uploadedFile.url, // must be returned from backend
        parentId: uploadedFile.parentId || parentId || undefined,
      };

      setFolders((prev) => {
        const update = (items: FileItem[], pathIndex: number): FileItem[] => {
          if (pathIndex >= currentPath.length) return [...items, newFile];
          const targetId = currentPath[pathIndex];
          return items.map((item) => {
            if (item.id === targetId && item.type === "folder") {
              return {
                ...item,
                children: update(item.children || [], pathIndex + 1),
              };
            }
            return item;
          });
        };
        return update(prev, 0);
      });

      setShowUploadModal(false);
    } catch (err) {
      console.error("Upload file failed", err);
    }
  };


  const handleCreateFolder = async (name: string) => {
    try {
      const parentId = currentPath.at(-1) || null;
      const newFolder = await createFolder(name, parentId, token); // API call

      setFolders((prev) => {
        // Recursive function to update nested folders
        const updateFolderStructure = (items: FileItem[], pathIndex: number): FileItem[] => {
          if (pathIndex >= currentPath.length) {
            // Target folder reached → insert new folder here
            return [...items, { ...newFolder, type: "folder", children: [] }];
          }

          const targetId = currentPath[pathIndex];

          return items.map((item) => {
            if (item.id === targetId && item.type === "folder") {
              return {
                ...item,
                children: updateFolderStructure(item.children || [], pathIndex + 1),
              };
            }
            return item;
          });
        };

        return updateFolderStructure(prev, 0);
      });
    } catch (err) {
      console.error("Create folder failed", err);
    }

    setShowModal(false);
  };

  const getCurrentFolderItems = (): FileItem[] => {
    let current = folders;

    for (const id of currentPath) {
      const folder = current.find((f) => f.id === id && f.type === "folder");
      if (!folder || !folder.children) return [];
      current = folder.children;
    }

    return current;
  };

  const handleRename = async (id: string, newName: string, type?: string) => {
    // For files, use the updated file object from backend to update state
    const updateName = (items: FileItem[], updatedFile?: FileItem): FileItem[] =>
      items.map((item) => {
        if (item.id === id) {
          if (type === "file" && updatedFile) {
            // Only update name and url for files
            return { ...item, name: updatedFile.name, url: updatedFile.url };
          }
          return { ...item, name: newName };
        } else if (item.type === "folder" && item.children) {
          return { ...item, children: updateName(item.children, updatedFile) };
        }
        return item;
      });

    try {
      // Fallback: if type is not provided, find the item by id
      let actualType = type;
      if (!actualType) {
        const findType = (items: FileItem[]): string | undefined => {
          for (const item of items) {
            if (item.id === id) return item.type;
            if (item.type === "folder" && item.children) {
              const t = findType(item.children);
              if (t) return t;
            }
          }
          return undefined;
        };
        actualType = findType(folders);
      }
      if (actualType === "file") {
        const { renameFile } = await import("~/services/fileService");
        const updatedFile = await renameFile(id, newName, token);
        setFolders((prev) => updateName(prev, updatedFile));
        // If the preview modal is open for this file, update it
        setPreviewFile((prev) => (prev && prev.id === id ? { ...prev, name: updatedFile.name, url: updatedFile.url } : prev));
      } else {
        await renameFolder(id, newName, token);
        setFolders((prev) => updateName(prev));
      }
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  const handleDelete = async (id: string, type?: string) => {
    const removeItem = (items: FileItem[]): FileItem[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.type === "folder" && item.children) {
            return { ...item, children: removeItem(item.children) };
          }
          return item;
        });

    try {
      // Fallback: if type is not provided, find the item by id
      let actualType = type;
      if (!actualType) {
        const findType = (items: FileItem[]): string | undefined => {
          for (const item of items) {
            if (item.id === id) return item.type;
            if (item.type === "folder" && item.children) {
              const t = findType(item.children);
              if (t) return t;
            }
          }
          return undefined;
        };
        actualType = findType(folders);
      }
      if (actualType === "file") {
        const { deleteFile } = await import("~/services/fileService");
        await deleteFile(id, token);
      } else {
        await deleteFolder(id, token);
      }
      setFolders((prev) => removeItem(prev));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  return (
    <div className="flex h-screen">
      <Sidebar
        data={folders}
        hidden={sidebarHidden}
        setHidden={setSidebarHidden}
      />
      <main className={"flex-1 p-6 bg-gray-100 transition-all duration-300 lg:ml-64"}>
        <h1 className="text-2xl font-bold mb-4">My Drive</h1>
        <div className="flex justify-between mb-5">
          {currentPath.length > 0 && (
            <button
              className="text-sm lg:font-semibold text-blue-600 cursor-pointer hover:underline"
              onClick={() => setCurrentPath((prev) => prev.slice(0, -1))}
            >
              ← Back
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white p-2.5 text-sm lg:p-4 rounded-xl shadow-lg hover:shadow-md transition flex gap-3 items-center text-center cursor-pointer"
            >
              <FaUpload /> Upload File
            </button>
            
            <button
              onClick={() => setShowModal(true)}
              className="bg-white p-2.5 text-sm lg:p-4 rounded-xl shadow-lg hover:shadow-md transition flex gap-3 items-center text-center cursor-pointer"
            >
              <FaPlus /> Create Folder
            </button>
          </div>
        </div>

        <DriveContent 
          items={getCurrentFolderItems()} 
          onFolderClick={(id: string) => setCurrentPath((prev) => [...prev, id])} 
          onFileClick={(file: FileItem) => setPreviewFile(file)} 
          onRename={(id: string, newName: string, type?: string) => { void handleRename(id, newName, type); }} 
          onDelete={(id: string, type?: string) => { void handleDelete(id, type); }} 
        />
      </main>

      <CreateFolderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateFolder}
      />

      <UploadImageModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadImage}
      />

      <PreviewModal
        isOpen={!!previewFile}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
