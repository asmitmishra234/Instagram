
import axios from "axios";

const postApi = axios.create({
  baseURL: "https://instagram-8x5l.onrender.com/api/post",
  withCredentials: true,
});

const storyApi = axios.create({
 baseURL: "https://instagram-8x5l.onrender.com/api/story",
  withCredentials: true,
});

const reelApi = axios.create({
 baseURL: "https://instagram-8x5l.onrender.com/api/reel",
  withCredentials: true,
});

export const getFeedApi = async () => {
  const response = await postApi.get("/feed");
  return response.data;
};

export const createPostApi = async (formData) => {
  const response = await postApi.post("/create", formData);
  return response.data;
};

export const createStoryApi = async (formData) => {
  const response = await storyApi.post("/create", formData);
  return response.data;
};

export const createReelApi = async (formData) => {
  const response = await reelApi.post("/create", formData);
  return response.data;
};

export const getReelsApi = async () => {
  const response = await reelApi.get("/feed");
  return response.data;
};

export const toggleLikeApi = async (postId) => {
  const response = await postApi.patch(`/${postId}/like`);
  return response.data;
};

export const followUserApi = async (userId) => {
  const response = await postApi.post(`/${userId}/follow`);
  return response.data;
};

export const unfollowUserApi = async (userId) => {
  const response = await postApi.delete(`/${userId}/follow`);
  return response.data;
};

