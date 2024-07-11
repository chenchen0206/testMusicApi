const HYRequest = require("./request");

const wyRequest = new HYRequest({
  baseURL: "",
  timeout: 1500000,
  interceptors: {
    requestInterceptor: (config) => {
      
      return config;
    },
    requestInterceptorCatch: (err) => {
      return err;
    },
    responseInterceptor: async (res) => {
      console.log("响应拦截1", res.data)
      return res;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});
module.exports = wyRequest;
