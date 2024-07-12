const wyRequest = require("./utils/request");
const readFileData = require("./utils/readFileData");
const { cookieToJson, generateRandomChineseIP } = require('./utils/index')
const CryptoJS = require('crypto-js')

class Login {
    #ID_XOR_KEY_1 = '3go8&$8*3*3h0k(2)2'
    #cloudmusic_dll_encode_id(some_id) {
        let xoredString = ''
        for (let i = 0; i < some_id.length; i++) {
            const charCode =
                some_id.charCodeAt(i) ^ this.#ID_XOR_KEY_1.charCodeAt(i % this.#ID_XOR_KEY_1.length)
            xoredString += String.fromCharCode(charCode)
        }
        const wordArray = CryptoJS.enc.Utf8.parse(xoredString)
        const digest = CryptoJS.MD5(wordArray)
        return CryptoJS.enc.Base64.stringify(digest)
    }
    #setCookies(ctx, cookies) {
        let k = {
            'Max-Age': 'maxAge',
            'Expires': 'expires',
            'Path': 'path',
            'Domain': 'domain',
        }
        cookies.forEach((e) => {
            let list = e.split('; ')
            const cookieKeyVal = list[0].split('=');
            let obj = {}
            for (let i = 1; i < list.length; i++) {
                let item = list[i]
                let s = item.split('=');
                obj[k[s[0]]] = s[1].replace(";", "")
                if (obj.expires) {
                    obj.expires = new Date(obj.expires).getTime()
                }
                if (obj.maxAge) {
                    obj.maxAge = parseInt(obj.maxAge)
                }
            }
            ctx.cookies.set(cookieKeyVal[0], cookieKeyVal[1], obj);
        });
    }
    //邮箱登录
    loginEmail = async (ctx, next) => {
        const { email, md5_password, password } = ctx.request.body
        if (!email || !password) return ctx.body = { code: 2400, data: '邮箱和密码不能为空~' }
        const data = {
            username: email,
            password: md5_password || CryptoJS.MD5(password).toString(),
            rememberLogin: 'true',
            options: {
                crypto: 'weapi',
                uaType: 'pc',
                cookie: {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/login',
            data
        });
        console.log("*--------*", res)
        if (res.code === 502) return ctx.body = { code: 2400, data: '账号或密码错误~' }
        this.#setCookies(ctx, res.cookies)
        ctx.body = { code: 200, data: res }
    }

    //设置用户cookie
    setCookie = async (ctx, next) => {
        const { cookieStr } = ctx.request.body
        if (!cookieStr) return ctx.app.emit('error', 2002, ctx)
        const cookieObj = cookieToJson(cookieStr)
        readFileData.setCookies(cookieObj)
        ctx.body = { code: 200, data: 'cookie设置成功~' }
    }
    //获取游客登录的Cookie
    loginVisitor = async (ctx, next) => {
        let deviceidList = readFileData.getDeviceidText()
        const deviceId = deviceidList[Math.floor(Math.random() * deviceidList.length)]
        const encodedId = CryptoJS.enc.Base64.stringify(
            CryptoJS.enc.Utf8.parse(
                `${deviceId} ${this.#cloudmusic_dll_encode_id(deviceId)}`,
            ),
        )
        const data = {
            username: encodedId,
            options: {
                crypto: 'weapi',
                cookie: {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/register/anonimous',
            data
        });
        this.#setCookies(ctx, res.cookies)
        ctx.body = { code: 200, data: res }
    }

    //二维码登录的KEY生成
    loginQrKey = async (ctx, next) => {
        const data = {
            username: encodedId,
            options: {
                crypto: 'weapi',
                cookie: {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/weapi/login/qrcode/unikey',
            data
        });
        this.#setCookies(ctx, res.cookies)
        ctx.body = { code: 200, data: res }
    }

}

module.exports = new Login()