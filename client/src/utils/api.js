export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.44:5000/api";

export function buildUrl(path, query = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function requestApi(path, options = {}) {
  const { query, ...fetchOptions } = options;
  const isFormDataBody = fetchOptions.body instanceof FormData;
  const headers = {
    ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
    ...(fetchOptions.headers || {}),
  };
  const response = await fetch(buildUrl(path, query), {
    credentials: "include",
    ...fetchOptions,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export async function fetchJson(path, options = {}) {
  return requestApi(path, options);
}
