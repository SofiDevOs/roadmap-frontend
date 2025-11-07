import { apiClient } from "./utils/apiClient";

const BASE_API_URL  =  import.meta.env.DEV ? "http://localhost:8787" : import.meta.env.BACKEND_URL;

export const api = apiClient(BASE_API_URL  as string ) ;

export const getFullUrl = (path: string) =>  new URL(path, BASE_API_URL).toString();