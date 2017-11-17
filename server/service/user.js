/**
 * Created by swallow on 2017/10/27.
 */
const express = require('express')
const User = require('../db/User')
const router = express.Router()
router.get('/user/getMyCreation', (req, res) => {
  'use strict'
  let user = req.query.user
  let result = []
  if (user) {
    let userReg = /^[0-9a-zA-Z_]{6,16}$/
    if (userReg.test(user)) {
      User.findOne({username: user})
        .populate({
          path: 'myCreation.root',
          options: {
            sort: {date: -1}
          }
        })
        .exec((err, user) => {
          if (err) {
            res.send({permit: false})
          } else {
            if (user) {
              if (user.myCreation.root) {
                user.myCreation.root.forEach((root) => {
                  result.push({
                    name: root.name,
                    content: root.content
                  })
                })
                res.send({permit: true, result: result})
              } else {
                // 普通故事节点今后写在这里
                res.send({permit: true, result: result})
              }
            } else {
              res.status(404)
            }
          }
        })
    } else {
      res.status(404)
    }
  } else {
    console.log('不是user')
    res.status(404)
  }
})
module.exports = router
