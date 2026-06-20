const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiFetch = async (url, token, options = {}) => {
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["x-auth-token"] = token;
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const ct = res.headers.get("content-type") || "";

  let data = null;

  if (ct.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  return { res, data };
};

export { BASE_API_URL };