/**
 * Created by swallow on 2017/10/7.
 */
const express = require('express')
const User = require('../db/User')
const router = express.Router()
const md5 = require('md5')
const svgCaptcha = require('svg-captcha')
// const gm = require('gm').subClass({imageMagick: true})
const tool = require('../tool')
router.post('/register', (req, res) => {
  let username = req.body.username
  let nickname = req.body.nickname
  let password = req.body.password
  let captcha = req.body.captcha
  let userReg = /^[0-9a-zA-Z_]{6,16}$/   // 字母数字下划线
  let nickReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,7}$/  // 中文数字字母
  let psReg = /^[A-Za-z0-9]{6,16}$/
  // console.log('收到的验证码' + captcha)
  // ('session验证码' + req.session.captchaText)
  // console.log(req.session.captchaText === captcha)
  if (captcha.toLowerCase() === req.session.captchaText) {
    if (userReg.test(username) && nickReg.test(nickname) && psReg.test(password)) {
      User.findOne({username: username}, (error, doc) => {
        'use strict'
        if (error) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          if (doc) {
            res.send({error: true, message: '该用户名已经存在', type: 'User'})
          } else {
            User.findOne({nickname: nickname}, (error2, nick) => {
              if (error2) {
                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
              } else {
                if (nick) {
                  res.send({error: true, message: '该昵称已经存在', type: 'User'})
                } else {
                  let user = {
                    username: username,
                    nickname: nickname,
                    password: md5(password)
                  }
                  let newUser = new User(user)
                  newUser.save((err, doc) => {
                    if (err) {
                      res.send({error: true, type: 'DB', message: '注册失败，请稍后再试'})
                    } else {
                      req.session.user = doc.username
                      req.session.userId = doc.id
                      res.cookie('And', {user: doc.username, userId: doc.id}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
                      res.send({error: false, message: '注册成功'})
                    }
                  })
                }
              }
            })
          }
        }
      })
    } else {
      res.send({error: true, type: 'User', message: '注册信息有误'})
    }
  } else {
    res.send({error: true, type: 'User', message: '验证码错误'})
  }
})
router.post('/register/checkUserRepeated', (req, res) => {
  'use strict'
  let username = req.body.username
  User.findOne({username: username}, (error, doc) => {
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
router.post('/register/login', (req, res) => {
  'use strict'
  let username = req.body.username
  let password = req.body.password
  User.findOne({username: username}, (err, user) => {
    if (err) {
      res.send({permit: false, message: '服务器忙，请稍后再试'})
    } else {
      if (user) {
        if (user.password === md5(password)) {
          req.session.user = user.username
          req.session.userId = user.id
          res.cookie('And', {user: user.username, userId: user.id}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
          res.send({permit: true, id: user.id, message: '登录成功'})
        } else {
          res.send({permit: false, message: '用户名密码不正确'})
        }
      } else {
        res.send({permit: false, message: '用户名不存在'})
      }
    }
  })
  // if (req.body.captcha.toLowerCase() === req.session.loginCaptchaText) {
  //   let username = req.body.username
  //   let password = req.body.password
  //   User.findOne({username: username}, (err, user) => {
  //     if (err) {
  //       res.send({permit: false, message: '服务器忙，请稍后再试'})
  //     } else {
  //       if (user) {
  //         if (user.password === md5(password)) {
  //           req.session.user = user.username
  //           res.cookie('And', {user: user.username}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 14), httpOnly: true })
  //           res.send({permit: true, id: user.id, message: '登录成功'})
  //         } else {
  //           res.send({permit: false, message: '用户名密码不正确'})
  //         }
  //       } else {
  //         res.send({permit: false, message: '用户名不存在'})
  //       }
  //     }
  //   })
  // } else {
  //   // 验证码错误
  //   res.send({permit: false, message: '验证码错误'})
  // }
})
router.get('/register/checkLogin', (req, res) => {
  'use strict'
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
              user: user.id,
              nickName: user.nickname,
              sign: user.sign,
              headImg: tool.formImg(user.headImg),
              follower: user.follower.length
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
            user: result.id,
            nickName: result.nickname,
            sign: result.sign,
            headImg: tool.formImg(result.headImg),
            follower: result.follower.length
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
router.get('/register/checkUser', (req, res) => {
  let user = req.query.user
  let userReg = /^([0-9]){7}$/
  let loginUser
  let sex   // 性别
  if (req.session.user) {        // 获取当前登录信息
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  } else {
    loginUser = ''
  }
  if (userReg.test(user)) {
    let userInfo = {
      user: '',
      nickName: '',
      sign: '',
      userId: '',
      headImg: '',
      follower: 0
    }
    User.findOne({id: user})
      .exec((err, account) => {
        if (err) {
          res.send({user: null})
        } else {
          if (account) {
            userInfo.user = account.id
            userInfo.nickName = account.nickname
            userInfo.sign = account.sign
            userInfo.userId = account.id
            userInfo.headImg = tool.formImg(account.headImg)
            userInfo.follower = account.follower.length
            if (account.username === loginUser) {
              res.send({user: userInfo, customer: false}) // 是本人，非访客模式
            } else {
              if (account.sex === '女') {
                sex = '她'
              } else if (account.sex === '男') {
                sex = '他'
              } else {
                sex = 'Ta'
              }
              res.send({user: userInfo, customer: true, sex: sex}) // 访客模式
            }
          } else {
            res.send({user: null}) // 不存在的用户名
          }
        }
      })
  } else {
    res.send({user: null})  // 不合法
  }
})
router.get('/register/quitLogin', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.send({error: true, message: '发生错误，请稍后再试'})
    } else {
      res.cookie('And', {user: null, userId: null}, {maxAge: 0}) // 删除cookie
      res.send({error: false})
    }
  })
})

module.exports = router
