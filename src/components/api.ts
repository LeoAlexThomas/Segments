import { getApiUrl } from "@/env";
import { parseCookies } from "nookies";
import { userTokenCookieName } from "./utils";
const axios = require("axios");

export const getAccessToken = (options: any) => {
  const cookies = parseCookies(options && options.context);
  const token = cookies[userTokenCookieName];
  return token;
};

const api = (route: string, options?: any, baseUrl?: string) => {
  const combinedOptions = Object.assign({}, options);

  axios.interceptors.request.use((request: any) => {
    const token = getAccessToken(options);
    if (token && !request.headers["Authorization"]) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  });

  const apiBaseUrl = baseUrl ?? getApiUrl();
  return axios({
    url: apiBaseUrl + route,
    ...combinedOptions,
    transformResponse: (res: any, headers: Record<string, string>) => {
      if (!Boolean(res)) {
        return null;
      }
      if (headers["content-type"].startsWith("application/json")) {
        return JSON.parse(res);
      }
      return res;
    },
  }).then((res: any) => {
    return res.data;
  });
};
export default api;
