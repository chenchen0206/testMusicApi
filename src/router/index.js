const fs = require('fs')
const path = require('path')

function registerRouters(app) {
  // 1.读取当前文件夹下的所有文件
  let filterFileRouter = (filePath) => {
    const files = fs.readdirSync(filePath)
    for (const file of files) {
      const url = path.join(filePath, file)
      let isFile = fs.lstatSync(url).isFile()
      if (!isFile) {
        filterFileRouter(url)
      } else {
        if (!file.endsWith('.router.js')) continue
        const router = require(url)
        app.use(router.routes())
        app.use(router.allowedMethods())
      }
    }
  }
  filterFileRouter(__dirname)
}

module.exports = registerRouters
