import { apiClient } from "./utils/apiClient";

const BASE_API_URL  =  import.meta.env.BACKEND_URL;

export const api = apiClient(BASE_API_URL);

export const getFullUrl = (path: string) =>  new URL(path, BASE_API_URL).toString();