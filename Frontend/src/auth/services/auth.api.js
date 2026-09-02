import axios from "axios";

const authApi = axios.create({
  baseURL: "https://instagram-8x5l.onrender.com/api/auth",
  withCredentials: true,
});

export const registerUser = async (data) => {
  const response = await authApi.post("/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await authApi.post("/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authApi.post("/logout");
  return response.data;
};

export const getMeApi = async () => {
  const response = await authApi.get("/get-me");
  return response.data;
};

export const updateProfileApi = async (data) => {
  const isFormData = data instanceof FormData;

  const response = await authApi.put("/update-profile", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : {},
  });

  return response.data;
};