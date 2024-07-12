const KoaRouter = require('@koa/router')

const { loginEmail, setCookie, loginVisitor, loginQrKey, loginQrCreate, loginQrCheck, loginStatus
} = require('../musicSdk/wy/login')
const { userAccount } = require('../musicSdk/wy/user')

const wyRouter = new KoaRouter({ prefix: '/wy' })

wyRouter.post('/login/email', loginEmail)
wyRouter.post('/login/setCookie', setCookie)
wyRouter.post('/login/visitor', loginVisitor)
wyRouter.post('/login/qrKey', loginQrKey)
wyRouter.post('/login/qrCreate', loginQrCreate)
wyRouter.post('/login/qrCheck', loginQrCheck)
wyRouter.post('/login/status', loginStatus)



wyRouter.post('/user/account', userAccount)
module.exports = wyRouter