/**
 * Created by swallow on 2017/10/27.
 */
const express = require('express')
const User = require('../db/User')
// const moment = require('moment')
const router = express.Router()
router.get('/user/getMyCreation', (req, res) => {
  'use strict'
  let user = req.query.user
  let rootList = []
  let storyList = []
  let result = []
  function bubbleSort (arr) {   // 排序算法
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j]['timeStamp'] < arr[j + 1]['timeStamp']) {
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    return arr
  }
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
        .populate({
          path: 'myCreation.story',
          populate: { path: 'root' },
          options: {
            sort: {date: -1}
          }
        })
        .exec((err, user) => {
          if (err) {
            res.send({permit: false})
          } else {
            if (user) {
              if (user.myCreation.root) {   // 存在根节点
                user.myCreation.root.forEach((root) => {
                  rootList.push({
                    root: root.name,
                    timeStamp: root.date.getTime(),
                    data: [root.id],
                    label: 'root'
                  })
                })
              }
              if (user.myCreation.story) {   // 存在普通故事节点
                user.myCreation.story.forEach((story) => {
                  storyList.push({
                    root: story.root.name,
                    id: story.id,
                    timeStamp: story.date.getTime(),
                    label: 'story'
                  })
                })
                let map = {}
                let dest = []
                for (let i = 0; i < storyList.length; i++) {
                  let ai = storyList[i]
                  if (!map[ai.root]) {
                    dest.push({
                      root: ai.root,
                      data: [ai.id],
                      timeStamp: ai.timeStamp
                    })
                    map[ai.root] = ai
                  } else {
                    for (let j = 0; j < dest.length; j++) {
                      let dj = dest[j]
                      if (dj.root === ai.root) {
                        dj.data.push(ai.id)
                        break
                      }
                    }
                  }
                }
                for (let i = 0; i < dest.length; i++) {
                  rootList.push({
                    root: dest[i].root,
                    data: dest[i].data,
                    timeStamp: dest[i].timeStamp
                  })
                }
                let temp = {}
                for (let i = 0; i < rootList.length; i++) {
                  let ai = rootList[i]
                  if (!temp[ai.root]) {
                    result.push({
                      root: ai.root,
                      data: ai.data,
                      label: ai.label,
                      date: ai.date,
                      timeStamp: ai.timeStamp
                    })
                    temp[ai.root] = ai
                  } else {
                    for (let j = 0; j < result.length; j++) {
                      let dj = result[j]
                      if (dj.root === ai.root) {
                        dj.timeStamp = ai.timeStamp
                        for (let k = 0; k < ai.data.length; k++) {
                          dj.data.push(ai.data[k])
                        }
                        break
                      }
                    }
                  }
                }
                // console.log('排序后')
                // console.log(JSON.stringify(bubbleSort(result)))
              }
              res.send({permit: true, result: bubbleSort(result)})
            } else {
              res.send({permit: false, type: '404'})
            }
          }
        })
    } else {
      res.send({permit: false, type: '404'})
    }
  } else {
    console.log('不是user')
    res.status(404)
  }
})
router.get('/user/getMySubscription', (req, res) => {
  'use strict'
  // let sysUser
  // if (req.session.user) {
  //   sysUser = req.session.user
  // } else if (req.cookies.And) {
  //   sysUser = req.cookies.And.user
  // }
  let user = req.query.user
  // let result = []
  // User.findOne({username: user})
  //   .populate('subscribe')
  //   .exec((err, user) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //     if (user) {
  //       for (let i = 0; i < user.subscribe.length; i++) {
  //         let sub = user.subscribe
  //         result.push({
  //           id: sub[i].id,
  //           name: sub[i].name,
  //           follower: sub[i].subscribe.length
  //         })
  //       }
  //       console.log(result)
  //       res.send(result)
  //     } else {
  //       // error
  //     }
  //   })
  console.log(user)
})
router.get('/test/tree')
module.exports = router
