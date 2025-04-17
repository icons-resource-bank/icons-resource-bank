import { useAuthStore } from "@/stores/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class HTTPError extends Error {
  constructor(
    public errors: string[],
    public status: number,
  ) {
    super(errors.join(", "));
  }
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

// Resource API functions
export enum ResourceType {
  URL = 1,
  FILE = 2,
}

export interface Resource {
  id: string;
  course: Course;
  type: ResourceType;
  title: string;
  description: string;
  createdAt: string;
  author: User;
  uri: string;
  tags: Filter[];
  downloadCount: number;
  pending: boolean;
  ftype: string; // PDF, Video, etc
}

export interface GetResourcesParams {
  limit?: number;
  offset?: number;
  query?: string;
  title?: string;
  description?: string;
  type?: ResourceType;
  courseIds?: string[];
  authorIds?: string[];
  tagIds?: string[];
  createdBefore?: string;
  createdAfter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  ftype?: string | string[];
  pending?: boolean;
}

export interface DownloadResponse {
  url: string;
  filename?: string;
}

export const resourceApi = {
  getResources: async (params: GetResourcesParams = {}): Promise<PaginatedResponse<Resource>> => {
    let endpoint = "/resources";
    const urlParams = new URLSearchParams();

    if (params.limit) urlParams.append("limit", params.limit.toString());
    if (params.offset !== undefined) urlParams.append("offset", params.offset.toString());
    if (params.query) urlParams.append("query", params.query);
    if (params.title) urlParams.append("title", params.title);
    if (params.description) urlParams.append("description", params.description);
    if (params.type) urlParams.append("type", params.type.toString());
    if (params.courseIds?.length) {
      params.courseIds.forEach((id) => urlParams.append("course_ids", id));
    }
    if (params.authorIds?.length) {
      params.authorIds.forEach((id) => urlParams.append("author_ids", id));
    }
    if (params.tagIds?.length) {
      params.tagIds.forEach((id) => urlParams.append("tag_ids", id));
    }
    if (params.createdBefore) urlParams.append("created_before", params.createdBefore);
    if (params.createdAfter) urlParams.append("created_after", params.createdAfter);
    if (params.sortBy) urlParams.append("sort_by", params.sortBy);
    if (params.sortOrder) urlParams.append("sort_order", params.sortOrder);
    if (params.ftype) {
      if (Array.isArray(params.ftype)) {
        params.ftype.forEach((type) => urlParams.append("ftype", type));
      } else {
        urlParams.append("ftype", params.ftype);
      }
    }
    if (params.pending !== undefined) urlParams.append("pending", params.pending.toString());

    if (urlParams.toString()) {
      endpoint += `?${urlParams.toString()}`;
    }

    return fetchApi<PaginatedResponse<Resource>>(endpoint);
  },

  getResource: async (id: string): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}`);
  },

  downloadResource: async (id: string): Promise<DownloadResponse> => {
    return fetchApi<DownloadResponse>(`/resources/${id}/download`, {
      method: "POST",
    });
  },

  createResource: async (payload: Partial<Resource>): Promise<Resource> => {
    const url = `${BASE_URL}/resources`;
    const { token } = useAuthStore.getState();

    const formData = new FormData();
    if (payload.file) {
      formData.append("file", payload.file);
      payload.file = undefined; // Remove file from payload to avoid duplication
    }
    formData.append("payload_json", JSON.stringify(camelToSnakeCase(payload)));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ?? "",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new HTTPError(errorData.errors || [`API error ${response.status}`], response.status);
    }

    const data = await response.json();
    return snakeToCamelCase(data) as Resource;
  },

  updateResource: async (id: string, resource: Partial<Resource>): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(resource),
    });
  },

  approveResource: async (id: string): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}/approve`, {
      method: "POST",
    });
  },

  denyResource: async (id: string): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}/deny`, {
      method: "POST",
    });
  },

  trackDownload: async (id: string): Promise<void> => {
    return fetchApi<void>(`/track`, {
      method: "POST",
      body: JSON.stringify({ event: "download", reference_id: id }),
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
