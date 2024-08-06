import { getToken } from "@/lib/getToken";
import axios, { InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
//edit
export const hestyAPI = axios.create({
  baseURL: baseURL,
});

export const studentAPI = axios.create({
  baseURL: baseURL + "/student",
});

export const parentAPI = axios.create({
  baseURL: baseURL + "/parent",
});

export const adminAPI = axios.create({
  baseURL: baseURL + "/admin",
});

export const teacherAPI = axios.create({
  baseURL: baseURL + "/teacher",
});

async function interceptor(config: InternalAxiosRequestConfig) {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

hestyAPI.interceptors.request.use(interceptor);
studentAPI.interceptors.request.use(interceptor);
parentAPI.interceptors.request.use(interceptor);
adminAPI.interceptors.request.use(interceptor);
teacherAPI.interceptors.request.use(interceptor);
