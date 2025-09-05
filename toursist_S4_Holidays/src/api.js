const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get auth token if set
function getToken() {
  return localStorage.getItem('adminToken');
}

// --- Admin Auth ---
export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password}),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('adminToken', data.token); // store token
  }
  return data;
}

// --- CRUD: Packages ---
export async function createPackage(formData) {
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: { 
      "Authorization": "Bearer " + getToken()
    },
    body: formData,
  });
  return await res.json();
}

export async function updatePackage(id, formData) {
  const res = await fetch(`${API_URL}/packages/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + getToken()
    },
    body: formData,
  });
  return await res.json();
}

export async function deletePackage(id) {
  const res = await fetch(`${API_URL}/packages/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + getToken()
    }
  });
  return await res.json();
}

export async function getPackagesByCategory(category) {
  const res = await fetch(`${API_URL}/packages/category/${category}`);
  return await res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/packages/stats`, {
    headers: {
      "Authorization": "Bearer " + getToken()
    }
  });
  return await res.json();
}
