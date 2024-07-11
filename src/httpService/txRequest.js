const HYRequest = require("./request");
const globalData = require("../musicSdk/tx/utils/globalData");
// service统一出口
// import HYRequest from "./request";
// import { BASE_URL, TIME_OUT } from "./request/config";
const xml2js = require('xml2js').parseString;

function handleXml(data) {
  return new Promise((resolve, reject) => {
    const handleObj = (obj) => {
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if ((typeof v).toLowerCase() === 'object' && v instanceof Array && v.length === 1) {
          obj[k] = v[0];
        }
        if ((typeof obj[k]).toLowerCase() === 'object') {
          handleObj(obj[k]);
        }
      })
    };

    xml2js(data, (err, result) => {
      handleObj(result);
      resolve(result);
    })
  })
}

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
    responseInterceptor: async (res) => {
      console.log("响应拦截1", res.data)
      if (typeof res.data === 'string' && res.data.includes('Callback')) {
        res.data = res.data.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, '');
        console.log("响应拦截2", res.data)
        return res;
      }
      if (typeof res.data === 'string' && res.data.startsWith('<?xml')) {
        let info = await handleXml(res.data.replace(/(<!--)|(-->)/g, ''));
        console.log("响应拦截3", info.result)
        return info.result;
      }
      return res;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});
module.exports = txRequest;
