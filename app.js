
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./server/api.js')
// const favicon = require('express-favicon')
// const easyMonitor = require('easy-monitor')
// easyMonitor('andromeda')
// const fs = require('fs')
// 引入处理post数据的模块
// 引入Express
const express = require('express')
// 引入connect-history-api-fallback
const history = require('connect-history-api-fallback')
const app = express()
// 扩展上传文件的大小
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}))
// 加载路由api
app.use(api)
app.use(history())
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, 'dist')))
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   next()
// })
// app.get('*', function (req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8')
//   res.send(html)
// })

const port = 8088
app.listen(port, '0.0.0.0', () => {
  console.log('success listen at ' + port)
})
module.exports = app
