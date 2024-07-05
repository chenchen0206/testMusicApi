
const globalData = require("./utils/globalData");

const globalCookieFun = async (ctx, next) => {
    globalData.getAllCookies()
    await next()
}

const takeCookieFun = async (ctx, next) => {
    const cookies = ctx.request.header.cookie;
    const publicCookieObj = globalData.allCookies.publicCookie || {};
    const publicCookie = Object.keys(publicCookieObj).map((k) => `${k}=${encodeURI(publicCookieObj[k])}`).join('; ');
    globalData.cookiesStr = cookies ?? publicCookie
    await next()
}

module.exports = {
    globalCookieFun,
    takeCookieFun
}