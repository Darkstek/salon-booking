const API_URL: string = "https://salon-server-production.up.railway.app";

export const fetchWithAuth = (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token: string | null = localStorage.getItem("token");

  return fetch(url, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

export default API_URL;
