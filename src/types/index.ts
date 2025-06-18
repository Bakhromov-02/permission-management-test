export interface PermissionPayload {
  apiKey: string;
  module: string;
  action: string;
}

export interface CheckPayload {
  apiKey: string;
  module: string;
  action: string;
}

export interface ListPayload {
  apiKey: string;
}

export interface Permission {
  module: string;
  action: string;
}

export enum ErrorCode {
  apiKey_not_found = 'apiKey_not_found',
  db_error = 'db_error',
  cache_error = 'cache_error',
  invalid_payload = 'invalid_payload',
  unknown = 'unknown'
}

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}
