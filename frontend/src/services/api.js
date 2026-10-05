const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  let response;
  const headers = new Headers(options.headers);
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Could not reach the DocIQ service. Check that the backend is running and try again. (${error.message})`,
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      detail || `The DocIQ service returned an error (${response.status}).`,
    );
  }

  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(
      "The DocIQ endpoint did not return JSON. Confirm the backend route is configured and the API URL is correct.",
    );
  }

  return response.json();
}

export async function getDocuments() {
  const data = await request("/api/documents");
  const documents = Array.isArray(data) ? data : data.documents;

  if (!Array.isArray(documents)) {
    throw new Error("The document service returned an unexpected response.");
  }

  return documents;
}

export async function uploadDocuments(files) {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);

  return request("/api/documents", {
    method: "POST",
    body: formData,
  });
}

export async function searchDocuments(query) {
  const data = await request(`/api/search?query=${encodeURIComponent(query)}`);
  const results = Array.isArray(data) ? data : data.results;

  if (!Array.isArray(results)) {
    throw new Error("The search service returned an unexpected response.");
  }

  return results;
}

export async function askQuestion(question) {
  const data = await request("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  });

  if (typeof data !== "string" && typeof data?.answer !== "string") {
    throw new Error("The question service returned an unexpected response.");
  }

  return data;
}

async function authenticate(path, values) {
  const data = await request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const token = data.access_token ?? data.token;
  const user = data.user ?? data.profile;

  if (typeof token !== "string" || !user || typeof user !== "object") {
    throw new Error("The authentication service returned an unexpected response.");
  }

  return { token, user };
}

export function signInUser(email, password) {
  return authenticate("/api/auth/login", { email, password });
}

export function createUserAccount(name, email, password) {
  return authenticate("/api/auth/register", {
    name,
    email,
    password,
  });
}

export async function signInAdmin(email, password) {
  const session = await authenticate("/api/auth/admin/login", {
    email,
    password,
  });
  const role = session.user.role ?? session.user.account_type;

  if (role !== "admin" && role !== "administrator") {
    throw new Error("This account does not have administrator access.");
  }

  return session;
}
