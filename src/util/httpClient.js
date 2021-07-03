import axios from "axios";
import i18n from "../plugins/i18n/i18n";

const httpClient = axios.create({
  baseURL: "http://localhost:5010/",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Managing Auth Credentials using `axios` interceptor.
 * Here we are creating an `auth` intercaptor to inject headers.
 */
const getAuthToken = () =>
  localStorage.getItem("tokens") != null
    ? `Bearer ${JSON.parse(localStorage.getItem("tokens")).accessToken}`
    : "";

export const getRefreshToken = () =>
  localStorage.getItem("tokens") != null
    ? JSON.parse(localStorage.getItem("tokens")).refreshToken
    : "";

const getLanguage = () => i18n.locale;

const authInterceptor = (config) => {
  config.headers["Authorization"] = getAuthToken();
  config.headers["Accept-Language"] = getLanguage();

  return config;
};

httpClient.interceptors.request.use(authInterceptor);

// /**
//  * Handling network errors and logging
//  */
const errorInterceptor = error => {
  switch (error.response.status) {
    case 401:
      var originalRequest = error.config;

      var refreshToken = getRefreshToken();

      console.log("Ovo je refresh token " + refreshToken);

      if(!refreshToken) {
        //window.location = "/login"
        return Promise.reject(error)
      }

      httpClient.post("api/account/RefreshToken", {refreshToken})
        .then(res => {
            localStorage.setItem("tokens", JSON.stringify(res.data));

            originalRequest.headers.Authorization = getAuthToken();

            return httpClient(originalRequest);
        })
        .catch(err => {
            console.log(err);

            localStorage.removeItem("tokens");

            return Promise.reject(error);
        });

      break
    default:
      console.error(error.response.status, error.message)
  }

  return Promise.reject(error)
}

const responseInterceptor = (response) => {
  return response;
};

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor); 

export default httpClient;
