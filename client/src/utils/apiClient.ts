import ky from "ky";

const apiClient = ky.create({
  headers: {
    "Content-Type": "application/json",
  },
  prefixUrl: "https://localhost:3001",
  credentials: "include",
});

export default apiClient;
