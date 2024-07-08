const HYRequest = require("./request");
const globalData = require("../musicSdk/tx/utils/globalData");
// service统一出口
// import HYRequest from "./request";
// import { BASE_URL, TIME_OUT } from "./request/config";

const txRequest = new HYRequest({
  baseURL: "",
  timeout: 1500000,
  interceptors: {
    requestInterceptor: (config) => {
      config.withCredentials = true
      config.xsrfCookieName = 'XSRF-TOKEN'
      config.headers.Cookie = globalData.cookiesStr
      console.log("*-------使每个请求带上", config.headers.Cookie)
      return config;
    },
    requestInterceptorCatch: (err) => {
      return err;
    },
    responseInterceptor: (res) => {
      console.log("响应拦截1", res.data)
      if (typeof res.data === 'string' && res.data.includes('Callback')) {
        res.data = res.data.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, '');
        console.log("响应拦截2", res.data)
        return res;
      }
      return res;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});
module.exports = txRequest;
