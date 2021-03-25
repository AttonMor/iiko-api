const axios = require("axios");

// Токен доступа к api
let token = "";

// Логин, для авторизации
const apiLogin = process.env.ApiLogin;

const api = axios.create({
  baseURL: "https://api-ru.iiko.services/api/",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  async (config) => {
    const access_token = token;
    config.headers = {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json"
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const { data } = await api.post("/1/access_token", {
      apiLogin
    });
    token = data.token;
    return data.token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = api;
