import { useAuthStore } from "@/stores/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

class HTTPError extends Error {
  constructor(
    public errors: string[],
    public status: number,
  ) {
    super(errors.join(", "));
  }
}

async function _request(method: string, url: string, options: RequestOptions = {}) {
  const { token } = useAuthStore.getState();

  const response = await fetch(BASE_URL + url, {
    method,
    headers: {
      "Authorization": token ?? "",
      "Content-Type": typeof options.body === "object" ? "application/json" : "application/x-www-form-urlencoded",
      ...options.headers,
    },
    body: typeof options.body !== "undefined" ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new HTTPError(errorData.errors || ["Failed to fetch"], response.status);
  }

  if (response.status === 204) {
    return null;
  }
  return await response.json();
}

export function get(url: string, options?: RequestOptions) {
  return _request("GET", url, options);
}

export function post(url: string, options?: RequestOptions) {
  return _request("POST", url, options);
}

export function put(url: string, options?: RequestOptions) {
  return _request("PUT", url, options);
}

export function del(url: string, options?: RequestOptions) {
  return _request("DELETE", url, options);
}

export function patch(url: string, options?: RequestOptions) {
  return _request("PATCH", url, options);
}

// Debugging
if (typeof window !== "undefined") {
  (window as any).http = {
    get,
    post,
    put,
    del,
    patch,
  };
}
