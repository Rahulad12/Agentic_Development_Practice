export interface PaginationParams {
  skip: number;
  take: number;
}

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const calculatePaginationMeta = (
  totalCount: number,
  skip: number,
  take: number
): PaginationMeta => {
  const pageSize = take;
  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(totalCount / take);

  return {
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
