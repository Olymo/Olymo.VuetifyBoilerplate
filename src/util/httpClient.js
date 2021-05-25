import axios from "axios";
import i18n from "../plugins/i18n/i18n";

const httpClient = axios.create({
  baseURL: "http://vozila.olymo.net:5111/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Managing Auth Credentials using `axios` interceptor.
 * Here we are creating an `auth` intercaptor to inject headers.
 */
const getAuthToken = () =>
  localStorage.getItem("user") != null
    ? `Bearer ${JSON.parse(localStorage.getItem("user")).accessToken}`
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
// const errorInterceptor = error => {
//   switch (error.response.status) {
//     case 401:
//       var originalRequest = error.config

//       if (originalRequest.url.includes('refreshToken')) {
//         store.dispatch('user/logout')
//         store.dispatch(
//           'notification/add',
//           {
//             type: 'warning',
//             message: 'Your session has expired. Please login again.'
//           },
//           {
//             root: true
//           }
//         )

//         window.location = '/login'
//         return Promise.reject(error)
//       }

//       if (!originalRequest._retry) {
//         originalRequest._retry = true

//         var refreshToken = JSON.parse(window.localStorage.getItem('user'))
//           .refreshToken

//         return httpClient
//           .post('/account/refreshToken', {
//             refreshToken
//           })
//           .then(res => {
//             if (res.status === 200) {
//               window.localStorage.setItem('user', JSON.stringify(res.data))

//               originalRequest.headers.Authorization = getAuthToken()

//               return httpClient(originalRequest)
//             }
//           })
//       }

//       break
//     default:
//       console.error(error.response.status, error.message)
//   }

//   return Promise.reject(error)
// }

const responseInterceptor = (response) => {
  return response;
};

httpClient.interceptors.response.use(responseInterceptor);

export default httpClient;
