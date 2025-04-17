import { useAuthStore } from "@/stores/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  token?: string // Add optional token parameter
  params?: Record<string, string>
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
  const token = options.token || useAuthStore.getState().token;

  let fullUrl = BASE_URL + url

  if (options.params) {
    const searchParams = new URLSearchParams()
    Object.entries(options.params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })
    fullUrl += `?${searchParams.toString()}`
  }

  const response = await fetch(fullUrl, {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": typeof options.body === "object" ? "application/json" : "application/x-www-form-urlencoded",
      ...options.headers,
    },
    body: typeof options.body !== "undefined" ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json()
      throw new HTTPError(errorData.errors || ["Failed to fetch"], response.status)
    } catch (e) {
      // If parsing JSON fails, use status text
      if (e instanceof HTTPError) throw e
      throw new HTTPError([response.statusText], response.status)
    }
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

// Server-side version that accepts a token directly
// This is useful for API routes where useAuthStore is not available
export const server = {
  async get(url: string, token: string, options: Omit<RequestOptions, "token"> = {}) {
    return _request("GET", url, { ...options, token })
  },
  async post(url: string, token: string, options: Omit<RequestOptions, "token"> = {}) {
    return _request("POST", url, { ...options, token })
  },
  async put(url: string, token: string, options: Omit<RequestOptions, "token"> = {}) {
    return _request("PUT", url, { ...options, token })
  },
  async del(url: string, token: string, options: Omit<RequestOptions, "token"> = {}) {
    return _request("DELETE", url, { ...options, token })
  },
  async patch(url: string, token: string, options: Omit<RequestOptions, "token"> = {}) {
    return _request("PATCH", url, { ...options, token })
  },
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
