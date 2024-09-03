export interface GenericEntity {
  id: string;
  created_at: string;
  modified_at: string;
}

export interface Pagination {
  offset: number;
  limit: number;
  total: number;
}
