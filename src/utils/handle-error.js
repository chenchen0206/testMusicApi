const app = require('../app')

app.on('error', (code, ctx) => {
  let message = ''
  switch (code) {
    case 2001:
      message = '未获取到数据~'
      break
    case 2002:
      message = '缺少请求参数~'
      break
    case 2003:
      message = '请填写正确的请求参数~'
      break
    case 2004:
      message = '没有cookies 请登陆后使用~'
      break
    case 2005:
      message = '获取链接失败，建议检查一下~'
      break
  }

  ctx.body = { code, message }
})
