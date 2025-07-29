const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});


// Upload a file to a specific folder (child folder or root)
export const uploadFile = async (
  file: File,
  parentId: string | null, // parentId is the folder where the file will be placed
  token: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (parentId) formData.append("folderId", parentId);

  const res = await fetch(`${BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here; fetch will set it for FormData
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload file");
  if (res.status === 204) return null; // No content returned
  return res.json();
};


// List files in a specific folder (child folder or root)
export const listFiles = async (
  parentId: string | null,
  token: string
) => {
  const url = new URL(`${BASE_URL}/files`);
  if (parentId) url.searchParams.append("folderId", parentId);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Files response: ", res);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
};

export const renameFile = async (
  id: string,
  newName: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/files/${id}/rename`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) throw new Error("Failed to rename file");
  // The backend returns { message, file }
  const data = await res.json();
  return data.file;
};

export const deleteFile = async (
  id: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/files/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to delete file");
  return res.json();
};
