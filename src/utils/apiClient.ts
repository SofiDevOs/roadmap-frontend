import { getFullUrl } from "src/consts";

export const apiClient =
  (baseUrl: string) =>
  (resource: string) =>
  (...segments: string[]) =>
  async <T>(options: RequestInit = {}): Promise<[T | null, Error | null, number | null]> => {
    const path = [resource, ...segments].filter(Boolean).join("/");
    const url = getFullUrl(path);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return [data, null, response.status];
    } catch (error: Error | unknown) {
      console.error("Fetch error:", error);
      return [null, error as Error, null];
    }

  };
