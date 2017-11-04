/**
 * Created by swallow on 2017/10/7.
 */
const express = require('express')
const User = require('../db/User')
const router = express.Router()
const md5 = require('md5')
const svgCaptcha = require('svg-captcha')

router.post('/register', (req, res) => {
  let username = req.body.username
  let nickname = req.body.nickname
  let password = req.body.password
  let captcha = req.body.captcha
  let userReg = /^[0-9a-zA-Z_]{6,16}$/   // 字母数字下划线
  let nickReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,7}$/  // 中文数字字母
  let psReg = /^[A-Za-z0-9]{6,16}$/
  // console.log('收到的验证码' + captcha)
  // console.log('session验证码' + req.session.captchaText)
  // console.log(req.session.captchaText === captcha)
  if (captcha.toLowerCase() === req.session.captchaText) {
    if (userReg.test(username) && nickReg.test(nickname) && psReg.test(password)) {
      User.findOne({username: username}, (error, doc) => {
        'use strict'
        if (error) {
          console.log(error)
        } else {
          if (doc) {
            res.send('该用户名已经存在')
            return {}
          } else {
            User.findOne({nickname: nickname}, (error2, nick) => {
              if (error2) {
                console.log(error2)
              } else {
                if (nick) {
                  res.send('该昵称已经存在')
                  return {}
                } else {
                  let user = {
                    username: username,
                    nickname: nickname,
                    password: md5(password)
                  }
                  let newUser = new User(user)
                  newUser.save((err) => {
                    if (err) {
                      console.log(err)
                      res.send('注册失败')
                    } else {
                      req.session.user = user.username
                      res.cookie('And', {user: user.username}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 14), httpOnly: true })
                      res.send('注册成功')
                    }
                  })
                }
              }
            })
          }
        }
      })
    } else {
      res.send('注册信息有误')
    }
  } else {
    res.send('验证码错误')
  }
})
router.post('/register/checkUserRepeated', (req, res) => {
  'use strict'
  let username = req.body.username
  User.findOne({username: username}, (error, doc) => {
    'use strict'
    if (error) {
      console.log(error)
    } else {
      if (doc) {
        res.send('用户名已经存在')
        return {}
      } else {
        res.send('ok')
      }
    }
  })
})
router.post('/register/checkNickRepeated', (req, res) => {
  'use strict'
  let nickname = req.body.nickname
  User.findOne({nickname: nickname}, (error, doc) => {
    'use strict'
    if (error) {
      console.log(error)
    } else {
      if (doc) {
        res.send('昵称已经存在')
        return {}
      } else {
        res.send('ok')
      }
    }
  })
})
router.get('/register/getCaptcha', (req, res) => {
  let captcha = svgCaptcha.create({ size: 5, noise: 3, ignoreChars: '0o1il' })
  req.session.captchaText = captcha.text.toLowerCase()
  res.set('Content-Type', 'image/svg+xml')
  res.status(200).send(captcha.data)
})
router.get('/login/getCaptcha', (req, res) => {
  let captcha = svgCaptcha.create({ size: 4, noise: 3, ignoreChars: '0o1il' })
  req.session.loginCaptchaText = captcha.text.toLowerCase()
  res.set('Content-Type', 'image/svg+xml')
  res.status(200).send(captcha.data)
})
router.post('/login', (req, res) => {
  'use strict'
  if (req.body.captcha.toLowerCase() === req.session.loginCaptchaText) {
    let username = req.body.username
    let password = req.body.password
    User.findOne({username: username}, (err, user) => {
      if (err) {
        res.send({permit: false, message: '服务器忙，请稍后再试'})
      } else {
        if (user) {
          if (user.password === md5(password)) {
            req.session.user = user.username
            res.cookie('And', {user: user.username}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 14), httpOnly: true })
            res.send({permit: true, message: '登录成功'})
          } else {
            res.send({permit: false, message: '用户名密码不正确'})
          }
        } else {
          res.send({permit: false, message: '用户名不存在'})
        }
      }
    })
  } else {
    // 验证码错误
    res.send({permit: false, message: '验证码错误'})
  }
})
router.get('/checkLogin', (req, res) => {
  'use strict'
  console.log('session中获取到账户名' + req.session.user)
  if (req.session.user) {
    User.findOne({username: req.session.user})
      .exec((err, user) => {
        if (err) {
          res.send({
            login: false,
            type: 'dbError',
            message: '系统忙，请稍后再试'
          })
        } else {
          if (user) {
            res.send({
              login: true,
              user: req.session.user,
              nickName: user.nickname
            })
          } else {
            res.send({
              login: false,
              type: 'sessionError'
            })
          }
        }
      })
  } else if (req.cookies.And) {
    console.log('cookies中获取的账户名' + req.cookies.And.user)
    User.findOne({username: req.cookies.And.user}, (err, result) => {
      if (err) {
        res.send({
          login: false,
          type: 'dbError',
          message: '系统忙，请稍后再试'
        })
      } else {
        if (result) {
          req.session.user = req.cookies.And.user
          res.send({
            login: true,
            user: req.session.user,
            nickName: result.nickname
          })
        } else {
          res.send({
            login: false,
            type: 'cookiesError'
          })
        }
      }
    })
  } else {
    res.send({
      login: false,
      type: 'notLogin'
    })
  }
})
router.get('/checkUser', (req, res) => {
  let user = req.query.user
  let userReg = /^[0-9a-zA-Z_]{6,16}$/   // 字母数字下划线
  let loginUser
  if (req.session.user) {        // 获取当前登录信息
    loginUser = req.session.user
  } else if (req.cookies.And) {
    if (req.cookies.And.user) {
      loginUser = req.cookies.And.user
    } else {
      loginUser = ''
    }
  } else {
    loginUser = ''
  }
  if (userReg.test(user)) {
    let userInfo = {
      user: '',
      nickName: ''
    }
    User.findOne({username: user})
      .exec((err, account) => {
        if (err) {
          res.send({user: null})
        } else {
          if (account) {
            userInfo.user = account.username
            userInfo.nickName = account.nickname
            if (user === loginUser) {
              res.send({user: userInfo, customer: false}) // 是本人，非访客模式
            } else {
              res.send({user: userInfo, customer: true}) // 访客模式
            }
          } else {
            res.send({user: null}) // 不存在的用户名
          }
        }
      })
  } else {
    res.send({user: null})
  }
})
router.get('/login/quitLogin', (req, res) => {
  req.session.destroy(function (err) {
    if (err) console.log(err)
    res.cookie('And', {account: null}, {maxAge: 0}) // 删除cookie
    res.send({login: false})
  })
})
module.exports = router
