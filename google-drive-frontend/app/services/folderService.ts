const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const fetchFolders = async (token: string) => {
  const res = await fetch(`${BASE_URL}/folders`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch folders");
  return res.json();
};

export const createFolder = async (
  name: string,
  parentId: string | null,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error("Failed to create folder");
  return res.json();
};

export const renameFolder = async (
  id: string,
  name: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to rename folder");
  return res.json();
};

export const deleteFolder = async (id: string, token: string) => {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete folder");
  return res.json();
};
