const demoDocuments = [
  {
    id: 1,
    name: "GreenLeaf Retail Sales Report.pdf",
    status: "Available",
    size: 2450000,
  },
  {
    id: 2,
    name: "Customer Analysis.xlsx",
    status: "Available",
    size: 890000,
  },
];

export async function getDocuments() {
  return demoDocuments;
}

export async function searchDocuments(query) {
  const lowerQuery = query.toLowerCase();

  return demoDocuments
    .filter((document) =>
      document.name.toLowerCase().includes(lowerQuery)
    )
    .map((document) => ({
      id: document.id,
      title: document.name,
      snippet: `This is a demo search result for "${query}".`,
    }));
}

export async function uploadDocuments(files) {
  console.log("Demo upload:", files);

  return files.map((file, index) => ({
    id: Date.now() + index,
    name: file.name,
    status: "Available",
    size: file.size,
  }));
}