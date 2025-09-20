export const apiClient =
  (baseUrl: string) =>
  (resource: string) =>
  (...segments: string[]) =>
  async (options: RequestInit = {}) => {
    const path = [resource, ...segments].filter(Boolean).join("/");
    const url = `${baseUrl}/${path}`;
    try {
      const response = await fetch(url, options);
      console.log(response);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null
    }

  };
