/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const router = express.Router()
const session = require('express-session')
const story = require('./service/story')
const register = require('./service/register')
const user = require('./service/user')
const cookieParser = require('cookie-parser')
router.use(session({
  secret: 'this_is_a_smart_website',
  name: 'swallow',   // 这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    httpOnly: true,
    maxAge: 3600 * 1000 * 24 * 14 // 设置maxAge是14天，即14天后session和相应的cookie失效过期
  },
  resave: true,
  saveUninitialized: true
}))
router.use(cookieParser('this_is_a_smart_website'))
router.use('/', story)
router.use('/', register)
router.use('/', user)
module.exports = router
