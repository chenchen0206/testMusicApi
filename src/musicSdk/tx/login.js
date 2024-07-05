const txRequest = require("../../httpService/index");
const getSign = require('./utils/sign');
const globalData = require("./utils/globalData");
class Login {
    constructor() {

    }
    //设置用户cookie
    setCookie = async (ctx, next) => {
        const { cookieStr } = ctx.request.body
        if (!cookieStr) return ctx.app.emit('error', 2002, ctx)
        const loginCookie = {};
        cookieStr.split('; ').forEach((c) => {
            const arr = c.split('=');
            loginCookie[arr[0]] = arr[1];
        });
        if (Number(loginCookie.login_type) === 2) {
            loginCookie.uin = userCookie.wxuin;
        }
        loginCookie.uin = (loginCookie.uin || '').replace(/\D/g, '');
        globalData.setAllCookies(loginCookie.uin || 'publicCookie', loginCookie)
        //设置返回的请求头
        ctx.response.set({
            'Access-Control-Allow-Origin': 'https://y.qq.com',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true'
        });
        Object.keys(loginCookie).forEach((k) => {
            // 有些过大的cookie 对登录校验无用，但是会导致报错
            if (loginCookie[k].length < 255) {
                ctx.cookies.set(k, loginCookie[k], { expires: new Date(Date.now() + 86400000) });
            }
        });
        ctx.body = { code: 200, data: 'cookie设置成功~' }
    }
    //获取用户cookie
    getCookie = async (ctx, next) => {
        const { id } = ctx.request.body
        if (!id) return ctx.app.emit('error', 2002, ctx)
        const allCookies = globalData.allCookies;
        const cookieObj = allCookies[id] || {};
        Object.keys(cookieObj).forEach((k) => {
            // 有些过大的cookie 对登录校验无用，但是会导致报错
            if (cookieObj[k].length < 255) {
                ctx.cookies.set(k, cookieObj[k], { expires: new Date(Date.now() + 86400000) });
            }
        });
        ctx.body = { code: 200, data: cookieObj }
    }

    //刷新登录 （不可用）
    refreshCookie = async (ctx, next) => {
        const uin = ctx.cookies.get('uin')
        const qm_keyst = ctx.cookies.get('qm_keyst')
        const qqmusic_key = ctx.cookies.get('qqmusic_key')
        if (!uin || !(qm_keyst || qqmusic_key)) return ctx.body = { code: 2400, data: 'cookie为空~' }
        const data = {
            req1: {
                module: "QQConnectLogin.LoginServer",
                method: "QQLogin",
                param: {
                    expired_in: 7776000, //不用管
                    // onlyNeedAccessToken: 0, //不用管
                    // forceRefreshToken: 0, //不用管
                    // access_token: "6B0C62126368CA1ACE16C932C679747E", //access_token
                    // refresh_token: "25BACF1650EE2592D06BCC19EEAD7AD6", //refresh_token
                    musicid: uin, //uin或者web_uin 微信没试过
                    musickey: qm_keyst || qqmusic_key, //key
                },
            },
        };
        const sign = getSign(data);
        let url = `https://u6.y.qq.com/cgi-bin/musics.fcg?sign=${sign}&format=json&inCharset=utf8&outCharset=utf-8&data=${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const res = await txRequest.get({ url });
        console.log("*-9999", res)
        ctx.body = { code: 200, data: '789555' }
    }
}

module.exports = new Login()