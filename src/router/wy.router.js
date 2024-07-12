const KoaRouter = require('@koa/router')

const { loginEmail, setCookie, loginVisitor } = require('../musicSdk/wy/login')
const { userAccount } = require('../musicSdk/wy/user')

const txRouter = new KoaRouter({ prefix: '/wy' })

txRouter.post('/login/email', loginEmail)
txRouter.post('/login/setCookie', setCookie)
txRouter.post('/login/visitor', loginVisitor)

txRouter.post('/user/account', userAccount)
module.exports = txRouter