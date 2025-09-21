export interface ApiResponse<T> {
  statusCode: number;
  statusMessage: string;
  data: T;
}

export interface ApiErrorResponse<T> {
  statusCode: number;
  errorMessage: string;
  action?: string;
  data?: T;
}
