// Shared types placeholder
// Will be populated during migration phase

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
