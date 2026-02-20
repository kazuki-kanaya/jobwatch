import axios, { type AxiosRequestConfig } from "axios";
import { env } from "@/lib/env";

const client = axios.create({
  baseURL: env.apiBaseUrl,
});

export const axiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return client({ ...config, ...options }).then(({ data }) => data);
};
