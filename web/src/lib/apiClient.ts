import axios, { type AxiosError, AxiosHeaders } from "axios";
import { getAccessToken } from "@/features/auth/auth.service";
import { env } from "@/lib/env";

type ErrorPayload = {
  detail?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ErrorPayload>(error)) {
    const status = error.response?.status ?? 0;
    const message = error.response?.data?.detail ?? error.message ?? `Request failed with status ${status}`;
    return new ApiError(status, message);
  }

  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }

  return new ApiError(0, "Unexpected request error");
};

const client = axios.create({
  baseURL: env.apiBaseUrl,
});

client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (!token) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorPayload>) => Promise.reject(toApiError(error)),
);

export const apiClient = {
  get: <T>(path: string) => client.get<T>(path).then((response) => response.data),
  post: <T>(path: string, body: unknown) => client.post<T>(path, body).then((response) => response.data),
  patch: <T>(path: string, body: unknown) => client.patch<T>(path, body).then((response) => response.data),
  delete: (path: string) => client.delete(path).then(() => undefined),
};
