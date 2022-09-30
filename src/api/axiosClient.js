import axios from "axios";
import queryString from "query-string";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = process.env.REACT_APP_BASE_URL;

let authTokens = localStorage.getItem("authTokens")
  ? JSON.parse(localStorage.getItem("authTokens"))
  : null;

const axiosClient = axios.create({
  baseURL,
  headers: {
    "content-type": "application/json",
    // Authorization: `Bearer ${authTokens?.accessToken}`,
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  let authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  config.headers.Authorization = `Bearer ${authTokens?.accessToken}`;
  config.headers["x-refresh"] = authTokens?.refreshToken;
  return config;
});
axiosClient.interceptors.response.use(
  async (response) => {
    if (response.headers && response.headers["x-access-token"]) {
      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          ...authTokens,
          accessToken: response.headers["x-access-token"],
        })
      );
      console.log("đã set new accessToken");
    }
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error.response.data;
  }
);
export default axiosClient;
