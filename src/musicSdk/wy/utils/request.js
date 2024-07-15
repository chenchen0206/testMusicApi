const HYRequest = require("../../../httpService/index");
const readFileData = require("./readFileData");
const encrypt = require('./crypto')
const http = require('http')
const https = require('https')
const CryptoJS = require('crypto-js')
const { URLSearchParams, URL } = require('url')
const { cookieObjToString } = require('./index')
const iosAppVersion = '9.0.65'

const chooseUserAgent = (uaType) => {
    const userAgentMap = {
        mobile:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
        pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    }
    return userAgentMap[uaType]
}
const reqInterceptorFun = (config) => {
    console.log("请求拦截1", config.data.options)
    const { options, ...q } = config.data;
    let cookie = options.cookie || {}
    let os = cookie.os || 'ios'
    let appver = cookie.appver || (cookie.os != 'pc' ? iosAppVersion : '')
    let headers = {
        os,
        appver
    }
    headers = {
        ...headers,
        ...options.headers,
    }
    if (config.method === 'post')
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (config.url.includes('music.163.com'))
        headers['Referer'] = 'https://music.163.com'
    let ip = options.realIP || options.ip || ''
    console.log("请求拦截IP", ip)
    if (ip) {
        headers['X-Real-IP'] = ip
        headers['X-Forwarded-For'] = ip
    }
    if (typeof options.cookie === 'object') {
        options.cookie = {
            ...options.cookie,
            __remember_me: true,
            // NMTID: CryptoJS.lib.WordArray.random(16).toString(),
            _ntes_nuid: CryptoJS.lib.WordArray.random(16).toString(),
            os,
            appver,
        }

        if (config.url.indexOf('login') === -1) {
            options.cookie['NMTID'] = CryptoJS.lib.WordArray.random(16).toString()
        }

        if (!options.cookie.MUSIC_U) {
            // 游客
            if (!options.cookie.MUSIC_A) {
                options.cookie.MUSIC_A = readFileData.getCookies().MUSIC_A
            }
            console.log('请求到这', options)
        }
        headers['Cookie'] = cookieObjToString(options.cookie)
    } else if (options.cookie) {
        // cookie string
        const cookie = cookieToJson(options.cookie)
        cookie.os = cookie.os || 'ios'
        cookie.appver = cookie.appver || (cookie.os != 'pc' ? iosAppVersion : '')
        headers['Cookie'] = cookieObjToString(cookie)
    } else {
        const cookie = cookieToJson('__remember_me=true; NMTID=xxx')
        cookie.os = cookie.os || 'ios'
        cookie.appver = cookie.appver || (cookie.os != 'pc' ? iosAppVersion : '')
        headers['Cookie'] = cookieObjToString(cookie)
    }
    if (options.crypto === 'weapi') {
        headers['User-Agent'] = options.ua || chooseUserAgent('pc')
        let csrfToken = (headers['Cookie'] || '').match(/_csrf=([^(;|$)]+)/)
        console.log('请求到了', csrfToken)
        q.csrf_token = csrfToken ? csrfToken[1] : ''
        config.data = encrypt.weapi(q)
        config.url = config.url.replace(/\w*api/, 'weapi')
    } else if (options.crypto === 'linuxapi') {
        data = encrypt.linuxapi({
            method: method,
            url: url.replace(/\w*api/, 'api'),
            params: data,
        })
        headers['User-Agent'] =
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
        url = 'https://music.163.com/api/linux/forward'
    } else if (options.crypto === 'eapi') {
        const cookie = options.cookie || {}
        const csrfToken = cookie['__csrf'] || ''
        const deviceId = readFileData.getDeviceId()
        const header = {
            osver: cookie.osver || '17.4.1', //系统版本
            deviceId: cookie.deviceId || deviceId,
            appver: cookie.appver || iosAppVersion, // app版本
            versioncode: cookie.versioncode || '140', //版本号
            mobilename: cookie.mobilename || '', //设备model
            buildver: cookie.buildver || Date.now().toString().substr(0, 10),
            resolution: cookie.resolution || '1920x1080', //设备分辨率
            __csrf: csrfToken,
            os: cookie.os || 'ios',
            channel: cookie.channel || '',
            requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(4, '0')}`,
        }
        if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
        if (cookie.MUSIC_A) header['MUSIC_A'] = cookie.MUSIC_A
        headers['Cookie'] = Object.keys(header)
            .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(header[key]))
            .join('; ')
        q.header = header
        config.data = encrypt.eapi(options.url, q)
        config.url = config.url.replace(/\w*api/, 'eapi')
    }

    config.data = new URLSearchParams(config.data).toString()
    config.headers = headers
    config.httpAgent = new http.Agent({ keepAlive: true })
    config.httpsAgent = new https.Agent({ keepAlive: true })
    if (options.crypto === 'eapi') {
        // config.responseType = 'arraybuffer'
        config.encoding = null
    }
    console.log("请求拦截3", config)
    return config;
}
const wyRequest = new HYRequest({
    timeout: 1500000,
    interceptors: {
        requestInterceptor: reqInterceptorFun,
        requestInterceptorCatch: (err) => {
            return err;
        },
        responseInterceptor: async (res) => {
            console.log("响应拦截1", res)
            let urlList = [
                'https://music.163.com/weapi/login',
                'https://music.163.com/weapi/register/anonimous',
                'https://music.163.com/weapi/login/qrcode/client/login'
            ]
            if (urlList.includes(res.config.url)) {
                res.data.cookies = (res.headers['set-cookie'] || []).map((x) =>
                    x.replace(/\s*Domain=[^(;|$)]+;*/, ''),
                )
                return res;
            }
            return res;
        },
        responseInterceptorCatch: (err) => {
            return err;
        },
    },
});
module.exports = wyRequest;
