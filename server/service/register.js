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
                      res.cookie('AndLogin', {account: md5(user.username)}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 10), httpOnly: true })
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
module.exports = router
