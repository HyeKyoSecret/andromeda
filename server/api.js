/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const router = express.Router()
const session = require('express-session')
const story = require('./service/story')
const register = require('./service/register')
const user = require('./service/user')
const dialogue = require('./service/dialogue')
const comment = require('./service/comment')
const history = require('./service/history')
const cookieParser = require('cookie-parser')
router.use(session({
  secret: 'this_is_a_smart_website',
  name: 'swallow',   // 这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    httpOnly: true,
    maxAge: 3600 * 1000 * 24 * 30 // 设置maxAge是30天，即30天后session和相应的cookie失效过期
  },
  resave: true,
  saveUninitialized: true
}))
router.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:9876, http://127.0.0.1:80, http://localhost:80')
  // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:80')
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})
router.use(cookieParser('this_is_a_smart_website'))
router.use('/', story)
router.use('/', register)
router.use('/', user)
router.use('/', comment)
router.use('/', history)
router.use('/', dialogue)
module.exports = router
