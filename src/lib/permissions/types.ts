export interface GrantRequest {
  apiKey: string;
  module: string;
  action: string;
}

export interface GrantResponse {
  status: 'ok';
}

export interface RevokeRequest {
  apiKey: string;
  module: string;
  action: string;
}

export interface RevokeResponse {
  status: 'ok';
}

export interface CheckRequest {
  apiKey: string;
  module: string;
  action: string;
}

export interface CheckResponse {
  allowed: boolean;
}

export interface ListRequest {
  apiKey: string;
}

export interface ListResponse {
  permissions: Array<{ module: string; action: string }>;
}
