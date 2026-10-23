export async function getDocuments() {
  // Backend is not connected yet.
  // This will later fetch the real documents from the API.
  return [];
}

export async function uploadDocuments(files) {
  // Temporary frontend-only upload response.
  // The actual upload/storage will be handled by the backend later.
  return files.map((file, index) => ({
    id: `${Date.now()}-${index}`,
    name: file.name,
    status: "Available",
    size: file.size,
  }));
}