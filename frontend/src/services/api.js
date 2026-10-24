const API_BASE_URL = "http://localhost:8000/api";

export async function getDocuments(workspaceId = "GreenLeaf Retail") {
  const response = await fetch(`${API_BASE_URL}/documents?workspace_id=${encodeURIComponent(workspaceId)}`);
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
}

export async function uploadDocuments(files, workspaceId = "GreenLeaf Retail") {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}/documents/upload?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload documents");
  return response.json();
}

export async function askAIAnalyst(question, workspaceId = "GreenLeaf Retail") {
  const response = await fetch(`${API_BASE_URL}/ai/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, workspace_id: workspaceId }),
  });

  if (!response.ok) throw new Error("Failed to generate AI insight");
  return response.json();
}

export async function askSQLAnalyst(question, dbUrl = "sqlite:///./test/test.db") {
  const response = await fetch(`${API_BASE_URL}/sql/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, db_url: dbUrl }),
  });

  if (!response.ok) throw new Error("Failed to execute Text-to-SQL query");
  return response.json();
}