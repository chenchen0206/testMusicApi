const wyRequest = require("./utils/request");
const { cookieToJson } = require('./utils/index')
class User {
    //获取用户账号信息
    userAccount = async (ctx, next) => {
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/nuser/account/get',
            data
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new User()