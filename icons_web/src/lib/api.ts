import { useAuthStore } from "@/stores/auth";
import { eventNames } from "process";

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

// API utility functions

// Utility functions to convert between camelCase and snake_case
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert object keys from camelCase to snake_case
function camelToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnakeCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = toSnakeCase(key);
    acc[snakeKey] = camelToSnakeCase(obj[key]);
    return acc;
  }, {} as any);
}

// Convert object keys from snake_case to camelCase
function snakeToCamelCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = snakeToCamelCase(obj[key]);
    return acc;
  }, {} as any);
}

// Generic fetch function with error handling
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const { token } = useAuthStore.getState();

  // Convert request body from camelCase to snake_case if it exists
  if (options.body && typeof options.body === "string") {
    try {
      const bodyObj = JSON.parse(options.body);
      options.body = JSON.stringify(camelToSnakeCase(bodyObj));
    } catch (e) {
      // Not JSON, leave as is
    }
  }

  const response = await fetch(url, {
    headers: {
      "Authorization": token ?? "",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new HTTPError(errorData.errors || [`API error ${response.status}`], response.status);
  }

  // For DELETE requests that return 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Convert response from snake_case to camelCase
  const data = await response.json();
  return snakeToCamelCase(data) as T;
}

// User API functions
export interface User {
  id: string;
  name: string;
  email: string;
  flags: number;
  createdAt: string;
  tempBannedUntil: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface BanUserParams {
  userId: string;
  until?: string | null;
}

export interface GetUsersParams {
  search?: string;
  flagFilter?: number;
  offset?: number;
  limit?: number;
}

export const userApi = {
  getUsers: async ({
    search,
    flagFilter,
    offset = 0,
    limit = 25,
  }: GetUsersParams): Promise<PaginatedResponse<User>> => {
    let endpoint = "/users";
    const params = new URLSearchParams();

    if (search) params.append("query", search);
    if (flagFilter !== undefined && flagFilter !== 0) params.append("flags", flagFilter.toString());
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return fetchApi<PaginatedResponse<User>>(endpoint);
  },

  getUser: async (id: string): Promise<User> => {
    return fetchApi<User>(`/users/${id}`);
  },

  banUser: async ({ userId, until }: BanUserParams): Promise<User> => {
    return fetchApi<User>(`/users/${userId}/ban`, {
      method: "POST",
      body: JSON.stringify({ until }),
    });
  },

  unbanUser: async (userId: string): Promise<User> => {
    return fetchApi<User>(`/users/${userId}/ban`, {
      method: "DELETE",
    });
  },

  updateUserFlags: async (userId: string, flags: number): Promise<User> => {
    return fetchApi<User>(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ flags }),
    });
  },

  deleteUser: async (userId: string): Promise<void> => {
    return fetchApi<void>(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

// Course API functions
export interface Course {
  id: string;
  code: string;
  name: string;
  category: string;
  yearLevel: number;
  icon: string;
  description: string;
  createdAt: string;
}

export const courseApi = {
  getCourses: async (search?: string, yearLevel?: number, category?: string): Promise<PaginatedResponse<Course>> => {
    let endpoint = "/courses";
    const params = new URLSearchParams();

    if (search) params.append("query", search);
    if (yearLevel && yearLevel > 0) params.append("year_level", yearLevel.toString());
    if (category && category !== "all") params.append("category", category);

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return fetchApi<PaginatedResponse<Course>>(endpoint);
  },

  getCourse: async (id: string): Promise<Course> => {
    return fetchApi<Course>(`/courses/${id}`);
  },

  createCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    return fetchApi<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
  },

  updateCourse: async (course: Course): Promise<Course> => {
    return fetchApi<Course>(`/courses/${course.id}`, {
      method: "PATCH",
      body: JSON.stringify(course),
    });
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    return fetchApi<void>(`/courses/${courseId}`, {
      method: "DELETE",
    });
  },
};

// Filter API functions
export interface Filter {
  id: string;
  name: string;
  color: number;
}

export const filterApi = {
  getFilters: async (): Promise<Filter[]> => {
    return fetchApi<Filter[]>("/tags");
  },

  getFilter: async (id: string): Promise<Filter> => {
    return fetchApi<Filter>(`/tags/${id}`);
  },

  createFilter: async (filter: Omit<Filter, "id">): Promise<Filter> => {
    return fetchApi<Filter>("/tags", {
      method: "POST",
      body: JSON.stringify(filter),
    });
  },

  updateFilter: async (filter: Filter): Promise<Filter> => {
    return fetchApi<Filter>(`/tags/${filter.id}`, {
      method: "PATCH",
      body: JSON.stringify(filter),
    });
  },

  deleteFilter: async (filterId: string): Promise<void> => {
    return fetchApi<void>(`/tags/${filterId}`, {
      method: "DELETE",
    });
  },
};

// Feedback API functions
export interface Feedback {
  id: string;
  comment: string;
  user: User;
  createdAt: string;
}

export interface GetFeedbackParams {
  offset?: number;
  limit?: number;
  query?: string;
}

export const feedbackApi = {
  getFeedback: async ({ offset = 0, limit = 25, query }: GetFeedbackParams): Promise<PaginatedResponse<Feedback>> => {
    let endpoint = "/feedback";
    const params = new URLSearchParams();

    params.append("offset", offset.toString());
    params.append("limit", limit.toString());
    if (query) params.append("query", query);

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return fetchApi<PaginatedResponse<Feedback>>(endpoint);
  },

  getFeedbackItem: async (id: string): Promise<Feedback> => {
    return fetchApi<Feedback>(`/feedback/${id}`);
  },

  submitFeedback: async (comment: string): Promise<Feedback> => {
    return fetchApi<Feedback>("/feedback", {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
  },

  deleteFeedback: async (id: string): Promise<void> => {
    return fetchApi<void>(`/feedback/${id}`, {
      method: "DELETE",
    });
  },
};
