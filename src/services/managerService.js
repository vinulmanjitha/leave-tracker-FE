const API_BASE_URL = "http://localhost:8080/api/leaves"; 

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }
  return response.json();
};

export const getAllLeaves = async () => {
  const response = await fetch(`${API_BASE_URL}`);
  return handleResponse(response);
};

export const updateLeaveStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/${id}/status?status=${status}`, {
    method: "PUT",
  });
  return handleResponse(response);
};
