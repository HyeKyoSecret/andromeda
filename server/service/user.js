/**
 * Created by swallow on 2017/10/27.
 */
const express = require('express')
const User = require('../db/User')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
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
    let userReg = /^U([0-9]){7}$/
    if (userReg.test(user)) {
      User.findOne({id: user})
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
  let result = []
  User.findOne({id: user})
    .populate('subscribe')
    .exec((err, user) => {
      if (err) {
        console.log(err)
      }
      if (user) {
        for (let i = 0; i < user.subscribe.length; i++) {
          let sub = user.subscribe
          result.push({
            id: sub[i].id,
            name: sub[i].name,
            follower: sub[i].subscribe.length
          })
        }
        res.send(result)
      } else {
        // error
      }
    })
})
router.get('/user/getSubStack', (req, res) => {
  'use strict'
  let fid = req.query.id
  let stack = []
  let p
  Root.findOne({id: fid}, (err, root) => {
    if (err) {
      console.log(err)
    }
    let getObj = function (id) {
      return new Promise((resolve, reject) => {
        Story.findOne({_id: id})
          .exec((err, story) => {
            if (err) {
              console.log(err)
            }
            if (story) {
              resolve(story)
            } else {
              Root.findOne({_id: id}, (err, root) => {
                if (err) {
                  console.log(err)
                }
                if (root) {
                  resolve(root)
                } else {
                  resolve(null)
                }
              })
            }
          })
      })
    }

    let exe = async function (root) {
      p = root._id
      let _temp
      let count = 0
      while (p || stack.length) {
        if (p) {
          count = count + 1
          _temp = await getObj(p)
          stack.push({
            _id: _temp._id,
            id: _temp.id,
            content: _temp.content
          })
          p = _temp.lc
        } else {
          stack.pop()
          p = _temp.rb
          if (!p && stack.length > 1) {
            _temp = await getObj(stack[stack.length - 1]._id)
            p = _temp.rb
            stack.pop()
          }
        }
      }
      res.send({count: count})
    }
    exe(root)
  })
})
router.get('/user/getContribute', (req, res) => {
  'use strict'
  let id = req.query.id
  let count = 0
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({count: count})
  }

  Root.findOne({id: id}, (err, root) => {
    if (err) {
      res.send({error: true})
    }
    if (root) {
      User.findOne({username: user})
        .exec((err, user) => {
          if (err) {
            res.send({error: true})
          }
          let getStoryRoot = function (id) {
            return new Promise((resolve, reject) => {
              Story.findOne({_id: id})
                .populate('root')
                .exec((err, story) => {
                  if (err) {
                    reject(err)
                  }
                  if (story) {
                    resolve(story.root._id)
                  } else {
                    resolve()
                  }
                })
            })
          }

          if (user) {
            user.myCreation.root.forEach(croot => {
              if (croot && root && croot.toString() === root._id.toString()) {
                count += 1
              }
            })
            let exe = async function () {
              for (let i = 0; i < user.myCreation.story.length; i++) {
                let cstory = await getStoryRoot(user.myCreation.story[i])
                if (cstory && root && cstory.toString() === root._id.toString()) {
                  count += 1
                }
                if (i === user.myCreation.story.length - 1) {
                  res.send({count: count})
                }
              }
            }
            exe()
          } else {
            res.send({error: true})
          }
        })
    } else {
      res.send({error: true})
    }
  })
})
module.exports = router
