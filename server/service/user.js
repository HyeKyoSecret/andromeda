/**
 * Created by swallow on 2017/10/27.
 */
const express = require('express')
const User = require('../db/User')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const moment = require('moment')
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
          while (!p && stack.length > 1) {
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
router.post('/user/addFriendRequest', (req, res) => {
  'use strict'
  const id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({id: id}, (err, toUser) => {
    if (err) {
      res.send({error: true, type: 'DB', message: '查询发生错误，请稍后再试'})
    }
    if (toUser) {
      User.findOne({username: user}, (err, user) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '查询发生错误，请稍后再试'})
        }
        if (user) {
          let confirmExist = toUser.pending.addFriend.some(function (list) {
            return list.from.toString() === user._id.toString()
          })
          if (confirmExist) {   // 检查对方列表中是否有自己发送的请求
            if (user.pending.request.some(function (list) {  // 检查自己待验证请求列表中是否存在已发送的请求
              return list.to.toString() === toUser._id.toString()
            })) {
              res.send({error: false, type: 'DB', message: '请不要重复发送好友请求'})
            } else {
              user.update({$push: {'pending.request': {'to': toUser._id, 'date': Date.now()}}})
                .exec((err2) => {
                  if (err2) {
                    res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                  }
                  res.send({error: false, message: '好友请求已发送'})
                })
            }
          } else {
            if (user.pending.request.some(function (list) {  // 检查自己待验证请求列表中是否存在已发送的请求
              return list.to.toString() === toUser._id.toString()
            })) {
              user.update({$pop: {'pending.request': {'to': toUser._id}}})
                .exec((err) => {
                  if (err) {
                    res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                  }
                  user.update({$push: {'pending.request': {'to': toUser._id, 'date': Date.now()}}})
                    .exec((err2) => {
                      if (err2) {
                        res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                      }
                      toUser.update({$push: {'pending.addFriend': {'from': user._id, 'date': Date.now()}}})
                        .exec((err3) => {
                          if (err3) {
                            res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                          } else {
                            res.send({error: false, message: '好友请求已发送'})
                          }
                        })
                    })
                })
            } else {    // 正常流程
              user.update({$push: {'pending.request': {'to': toUser._id, 'date': Date.now()}}})
                .exec((err2) => {
                  if (err2) {
                    res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                  }
                  toUser.update({$push: {'pending.addFriend': {'from': user._id, 'date': Date.now()}}})
                    .exec((err3) => {
                      if (err3) {
                        res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
                      } else {
                        res.send({error: false, message: '好友请求已发送'})
                      }
                    })
                })
            }
          }
        } else {
          res.send({error: true, type: 'User', message: '用户名错误，请尝试重新登录'})
        }
      })
    } else {
      res.send({error: true, type: 'url', message: 'url错误'})
    }
  })
})
router.get('/user/getPendingList', (req, res) => {
  'use strict'
  let loginUser
  const id = req.query.id
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  let result = {
    request: [],
    addFriend: []
  }
  User.findOne({id: id})
    .populate('pending.request.to')
    .populate('pending.addFriend.from')
    .exec((err, user) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (user && user.username === loginUser) {
        user.pending.request.forEach((request) => {
          result.request.push(
            {
              date: moment(request.date).format('lll'),
              state: request.state,
              to: request.to.nickname,
              toId: request.to.id
            }
          )
        })
        user.pending.addFriend.forEach((addFriend) => {
          result.addFriend.push({
            date: moment(addFriend.date).format('lll'),
            state: addFriend.state,
            from: addFriend.from.nickname,
            fromId: addFriend.from.id
          })
        })
        res.send({error: false, result: result})
      } else {
        res.send({error: true, type: 'auth', message: '没有查看权限'})
      }
    })
})
router.get('/user/acceptFriend', (req, res) => {
  'use strict'
  const id = req.query.id
  const fromId = req.query.fromId
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({id: id})
    .exec((err, user) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
      }
      if (user && user.username === loginUser) {
        User.findOne({id: fromId}, (error, fromUser) => {
          if (error || !fromUser) {
            res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
          } else {
            User.updateOne({id: id, })

          }
        })
      } else {
        res.send({error: true, type: 'auth', message: '您没有权限进行操作'})
      }
    })
})
router.get('/user/getMessageData', (req, res) => {
  'use strict'
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .exec((err, duser) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '查询发生错误，请稍后再试'})
      }
      if (duser) {
        res.send({error: false, user: duser.id})
      } else {
        res.send({error: true, type: 'user', message: '查询发生错误，请检查url'})
      }
    })
})
module.exports = router
