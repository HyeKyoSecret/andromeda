/**
 * Created by swallow on 2017/10/7.
 */
const express = require('express')
const User = require('../db/User')
const router = express.Router()
const md5 = require('md5')
router.post('/register', (req, res) => {
  let username = req.body.username
  let nickname = req.body.nickname
  let password = req.body.password
  let userReg = /^[0-9a-zA-Z_]{6,16}$/   // 字母数字下划线
  let nickReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,7}$/  // 中文数字字母
  if (userReg.test(username) && nickReg.test(nickname)) {
    User.findOne({username: username}, (error, doc) => {
      'use strict'
      if (error) {
        console.log(error)
      } else {
        if (doc) {
          console.log('接受到的username' + username)
          res.send('用户名已经存在')
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
              res.send('注册成功')
            }
          })
        }
      }
    })
  } else {
    res.send('注册信息有误')
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
module.exports = router
