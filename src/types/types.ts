export interface Response {
  message?: string;
  error?: string;
  code?: number;
  results?: any[] | any,
}

export interface ConfigRequest {
  deployment: string;
  key?: string;
  value?: string;
}
