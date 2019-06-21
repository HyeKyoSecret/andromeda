/**
 * Created by swallow on 2017/10/27.
 */
const express = require('express')
const User = require('../db/User')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const moment = require('moment')
const router = express.Router()
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const tool = require('../tool')
const gm = require('gm').subClass({imageMagick: true})
const rootReg = /^R([0-9]){7}$/
const storyReg = /^S([0-9]){7}$/
router.get('/user/getMySubscription', (req, res) => {
  'use strict'
  let user = req.query.user
  let result = []
  User.findOne({id: user})
    .populate('subscribe.root')
    .exec((err, user) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (user) {
        for (let i = 0; i < user.subscribe.length; i++) {
          let sub = user.subscribe
          result.push({
            id: sub[i].root.id,
            name: sub[i].root.name,
            follower: sub[i].root.subscribe ? sub[i].root.subscribe.length : 0,
            coverImg: tool.formImg(sub[i].root.coverImg)
          })
        }
        res.send({error: false, result: result})
      } else {
        res.send({error: true, type: 'user', message: '用户不存在'})
      }
    })
})
router.get('/user/getSubStack', (req, res) => {
  'use strict'
  let fid = req.query.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
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
      let readCount = 0
      let latest
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
      User.findOne({username: user})
        .populate('depth.rootId')
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB'})
          } else {
            for (let i = 0; i < doc.depth.length; i++) {
              if (doc.depth[i].rootId.id === fid) {
                readCount = doc.depth[i].storyId.length
                latest = doc.depth[i].latest
                break
              }
            }
            res.send({count: count, readCounts: readCount, latest: latest})
          }
        })
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
              if (user.myCreation.story.length === 0) {
                res.send({count: 0})
              } else {
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
            return (list.from.toString() === user._id.toString()) && list.state !== 'resolve'
          })
          if (confirmExist) {   // 检查对方列表中是否有自己发送的请求
            if (user.pending.request.some(function (list) {  // 检查自己待验证请求列表中是否存在已发送的请求
              return list.to.toString() === toUser._id.toString()
            })) {
              res.send({error: false, type: 'DB', message: '请不要重复发送好友请求'})
            } else {
              user.update({$push: {'pending.request': {'to': toUser._id, 'date': Date.now()}}})
                .exec(err2 => {
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
              toId: request.to.id,
              vis: true
            }
          )
        })
        user.pending.addFriend.forEach((addFriend) => {
          result.addFriend.push({
            date: moment(addFriend.date).format('lll'),
            state: addFriend.state,
            from: addFriend.from.nickname,
            fromId: addFriend.from.id,
            vis: true
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
  User.findOne({id: id}, function (err, user) {
    if (err) {
      res.send({error: true, message: '发生错误', type: 'DB'})
    } else {
      User.findOneAndUpdate({id: fromId}, {
        $addToSet: {'friendList': {'friend': user._id}},
        $push: {
          'promote': {'description': 'friendRequest', 'content_1': user.nickname, 'content_2': '接受了你的好友请求'}
        },
        $pull: {'pending.request': {'to': user._id}}
      })
        .exec((err2, doc) => {
          if (err2) {
            res.send({error: true, message: '发生错误', type: 'DB'})
          } else {
            User.updateOne({id: id}, {
              $addToSet: {'friendList': {'friend': doc._id}},
              $pull: {'pending.addFriend': {'from': doc._id}}
            })
              .exec(err3 => {
                if (err3) {
                  res.send({error: true, message: '发生错误', type: 'DB'})
                } else {
                  res.send({error: false, message: '操作成功'})
                }
              })
          }
        })
    }
  })
})
router.get('/user/getMessageData', (req, res) => {
  'use strict'
  let user
  let result = {
    words: 0,
    request: 0,
    promote: 0,
    announcement: 0
  }
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .exec((err, duser) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (duser) {
        for (let i = 0; i < duser.commentFrom.length; i++) {
          if (!duser.commentFrom[i].readed) {
            result.promote ++        // 通知数量 评论
          }
        }
        for (let i = 0; i < duser.subscribe.length; i++) {
          for (let j = 0; j < duser.subscribe[i].new.length; j++) {
            if (!duser.subscribe[i].new[j].readed) {
              result.promote ++     // 通知数量 订阅
            }
          }
        }
        for (let i = 0; i < duser.promote.length; i++) {
          if (!duser.promote[i].readed) {
            result.promote ++       // 通知数量 好友验证
          }
        }
        if (duser.pending && duser.pending.request) {
          for (let i = 0; i < duser.pending.request.length; i++) {
            if (!duser.pending.request[i].readed) {
              result.request ++
            }
          }
        }
        if (duser.pending && duser.pending.addFriend) {
          for (let i = 0; i < duser.pending.addFriend.length; i++) {
            if (!duser.pending.addFriend[i].readed) {
              result.request ++
            }
          }
        }
        for (let i = 0; i < duser.announcement.length; i++) {
          if (!duser.announcement.readed) {
            result.announcement ++
          }
        }
        res.send({error: false, user: duser.id, result: result})
      } else {
        res.send({error: true, type: 'user', message: '发生错误，请检查url'})
      }
    })
})
router.post('/user/delPendingAdd', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({id: req.body.fromId}, (err, fromUser) => {
    if (err) {
      res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
    } else {
      if (fromUser) {
        User.findOneAndUpdate({$and: [{ username: user }, { 'pending.addFriend.from': fromUser._id }]}, {$pull: { 'pending.addFriend': {'from': fromUser._id} }})
          .exec((err2, doc) => {
            if (err2) {
              console.log(err2)
              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
            } else {
              res.send({error: false, success: true})
            }
          })
      } else {
        res.send({error: true, type: 'User', message: '查询失败'})
      }
    }
  })
})
router.post('/user/delPendingReq', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({id: req.body.toId}, (err, toUser) => {
    if (err) {
      res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
    } else {
      if (toUser) {
        User.findOneAndUpdate({$and: [{ username: user }, { 'pending.request.to': toUser._id }]}, {$pull: { 'pending.request': {'to': toUser._id} }})
          .exec((err2) => {
            if (err2) {
              console.log(err2)
              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
            } else {
              res.send({error: false, success: true})
            }
          })
      } else {
        res.send({error: true, type: 'User', message: '查询失败'})
      }
    }
  })
})
router.get('/user/getPromote', (req, res) => {
  let user
  let temp
  let result = []
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          for (let i = 0; i < doc.promote.length; i++) {
            result.push({
              id: doc.promote[i]._id,
              content_1: doc.promote[i].content_1,
              content_2: doc.promote[i].content_2,
              content_3: doc.promote[i].content_3,
              content_4: doc.promote[i].content_4,
              description: doc.promote[i].description,
              date: moment(doc.promote[i].date).fromNow(),
              vis: true
            })
          }
          temp = doc.promote
          temp.forEach(item => {
            if (!item.readed) {
              item.readed = true
            }
          })
          User.updateOne({username: user}, {$set: {'promote': temp}})
            .exec(err => {
              if (err) {
                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
              } else {
                res.send({error: false, result: result})
              }
            })
        }
      }
    })
})
router.get('/user/getUserFriendshipAndFocus', (req, res) => {
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({id: req.query.user}, (err, user) => {  // 查询目标
    if (err) {
      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
    } else {
      if (user && loginUser) {
        User.findOne({username: loginUser}, (err2, me) => {
          if (err2) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            let friendCond = user.friendList.some(function (item) {
              return item.friend && (item.friend.toString() === me._id.toString())
            })
            let focusCond = me.focus.some(function (item) {
              return item && (item.toString() === user._id.toString())
            })
            res.send({error: false, friendCond: friendCond, focusCond: focusCond})
          }
        })
      }
    }
  })
})
router.post('/user/delPendingPromote', (req, res) => {
  let id = req.body.id
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.updateOne({username: loginUser}, {$pull: {'promote': {'_id': id}}})
    .exec(err => {
      if (err) {
        console.log(err)
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        res.send({error: false})
      }
    })
})
router.post('/user/deleteFriendRequest', (req, res) => {
  let id = req.body.id
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({id: id}, (err, user) => {
    if (err) {
      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
    } else {
      User.findOneAndUpdate({username: loginUser}, {$pull: {'friendList': {'friend': user._id}}})
        .exec((err2, doc) => {
          if (err2) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            User.updateOne({id: id}, {$pull: {'friendList': {'friend': doc._id}}})
              .exec(err3 => {
                if (err3) {
                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  res.send({error: false, message: '删除成功'})
                }
              })
          }
        })
    }
  })
})
router.get('/user/getFriendList', (req, res) => {
  let result = []
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({username: loginUser})
    .populate('friendList.friend')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          doc.friendList.forEach(function (friend) {
            result.push({
              name: friend.friend.nickname,
              id: friend.friend.id,
              active: false,
              headImg: tool.formImg(friend.friend.headImg)
            })
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: true, type: 'user', message: '发生错误，请重新登录'})
        }
      }
    })
})
router.get('/user/getFocusList', (req, res) => {
  let result = []
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({username: loginUser})
    .populate('focus')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          doc.focus.forEach(function (item) {
            result.push({
              name: item.nickname,
              id: item.id,
              headImg: tool.formImg(item.headImg)
            })
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: true, type: 'user', message: '发生错误，请重新登录'})
        }
      }
    })
})
router.post('/user/searchFriend', (req, res) => {
  let content = req.body.content
  let user = req.body.user
  let result = []
  User.findOne({id: user})
    .populate('friendList.friend')
    .sort({'username': 1})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          doc.friendList.forEach((item) => {
            'use strict'
            let reg = new RegExp(content, 'gi')
            if (reg.test(item.friend.nickname)) {
              result.push({
                name: item.friend.nickname,
                id: item.friend.id,
                active: false,
                headImg: tool.formImg(item.friend.headImg)
              })
            }
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: false, result: result})
        }
      }
    })
})
router.post('/user/searchFocus', (req, res) => {
  let content = req.body.content
  let user = req.body.user
  let result = []
  User.findOne({id: user})
    .populate('focus')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          doc.focus.forEach((item) => {
            'use strict'
            let reg = new RegExp(content, 'gi')
            if (reg.test(item.nickname)) {
              result.push({
                name: item.nickname,
                id: item.id,
                active: false,
                headImg: tool.formImg(item.headImg)
              })
            }
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: false, result: result})
        }
      }
    })
})
router.post('/user/searchFocus', (req, res) => {
  let content = req.body.content
  let user = req.body.user
  let result = []
  User.findOne({id: user})
    .populate('focus')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          doc.focus.forEach((item) => {
            'use strict'
            let reg = new RegExp(content, 'gi')
            if (reg.test(item.nickname)) {
              result.push({
                name: item.nickname,
                id: item.id,
                active: false,
                headImg: tool.formImg(item.headImg)
              })
            }
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: false, result: result})
        }
      }
    })
})
router.post('/user/searchPeople', (req, res) => {
  let content = req.body.content
  let result = []
  let reg = new RegExp(content, 'gi')
  User.findOne({nickname: reg})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          result.push({
            name: doc.nickname,
            id: doc.id,
            active: false,
            headImg: tool.formImg(doc.headImg)
          })
          res.send({error: false, result: result})
        } else {
          res.send({error: false, result: result})
        }
      }
    })
})
router.post('/user/changeBirthday', (req, res) => {
  'use strict'
  let date = req.body.date
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.updateOne({username: user}, {$set: {'birthday': date}})
      .exec((err) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          res.send({error: false, message: '修改成功'})
        }
      })
  } else {
    res.send({error: true, type: 'auth', message: '您没有权限操作'})
  }
})
router.post('/user/changeSex', (req, res) => {
  'use strict'
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let value = req.body.value
  if (user) {
    User.updateOne({username: user}, {$set: {'sex': value}}, {upsert: true})
      .exec((err) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          res.send({error: false, message: '修改成功'})
        }
      })
  } else {
    res.send({error: true, type: 'auth', message: '您没有权限操作'})
  }
})
router.get('/user/getChangeInfo', (req, res) => {
  'use strict'
  let id = req.query.id
  User.findOne({id: id})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        res.send({error: false, headImg: tool.formImg(doc.headImg), nickname: doc.nickname, sex: doc.sex, birthday: moment(doc.birthday).format('L'), sign: doc.sign})
      }
    })
})
router.post('/user/changeSign', (req, res) => {
  'use strict'
  let id = req.body.id
  let sign = req.body.sign
  if (sign.length >= 0 && sign.length <= 30) {
    if (req.session.userId === id || (req.cookies.And && req.cookies.And.userId === id)) {
      User.updateOne({id: id}, {$set: {'sign': sign}}, {upsert: true})
        .exec((err) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            res.send({error: false, message: '修改成功'})
          }
        })
    } else {
      res.send({error: true, type: 'auth', message: '您没有权限操作'})
    }
  } else {
    res.send({error: true, type: 'word', message: '签名格式有误，请检查后输入'})
  }
})
router.get('/user/getSign', (req, res) => { // 获得签名
  'use strict'
  let id = req.query.id
  User.findOne({id: id})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        res.send({error: false, sign: doc.sign})
      }
    })
})
router.post('/user/uploadHeadImg', function (req, res) {
  const form = new formidable.IncomingForm()
  const imgPath = path.resolve(__dirname, '../picture/head/')   // 图片保存路径
  // const targetPath = path.join(__dirname, './../tempPic/')      // 暂存路径/
  const proPath = path.join(__dirname, '../../dist/static/thumb/head/')    // 生产环境图片路径
  const thumbPath = path.join(__dirname, '../../static/thumb/head/')
  function copyIt (from, to) {    // 复制文件
    fs.writeFileSync(to, fs.readFileSync(from))
    // fs.createReadStream(src).pipe(fs.createWriteStream(dst))  大文件复制
  }
  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath)
  }
  if (!fs.existsSync(proPath)) {
    fs.mkdirSync(proPath)
  }
  if (!fs.existsSync(thumbPath)) {
    fs.mkdirSync(thumbPath)
  }
  form.uploadDir = imgPath
  form.keepExtensions = true    // 保存扩展名
  form.maxFieldsSize = 20 * 1024 * 1024   // 上传文件的最大大小
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
    }
    let fileName
    if (files.file) {
      fileName = tool.getFileName(files.file.path)
    } else {
      fileName = ''
    }
    let savePath = path.join(imgPath, fileName)
    let usePath = path.join(proPath, fileName)
    let thumbSavePath = path.join(thumbPath, fileName)
    User.findOneAndUpdate({id: fields.id}, {$set: {'headImg': savePath}})
      .exec((err, user) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，上传失败'})
        } else {
          // fs.renameSync(files.file.path, savePath)
          gm(savePath)
            .thumb(160, 160, thumbSavePath, 100, function (err) {
              if (err) {
                res.send({error: false, type: 'gm', message: '发生错误'})
              } else {
                copyIt(thumbSavePath, usePath)     // 拷贝文件
                tool.clearFiles(user.headImg)
                res.send({error: false, message: '上传成功'})
              }
            })
        }
      })
  })
})
router.get('/user/getHeadImg', (req, res) => {
  let user = req.cookies.And.user
  User.findOne({username: user}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      let img = result.headImg.split('/')
      img.splice(0, 5)
      let headImg = img.join('/')
      res.send({result: headImg})
    }
  })
})
router.get('/user/getMyCreation', (req, res) => {
  'use strict'
  let user = req.query.user
  let type = req.query.type
  let rootList = []
  let storyList = []
  let val = req.query.val
  function bubbleSort (arr) {   // 排序算法，从大到小
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
    let userReg = /^([0-9]){7}$/
    if (userReg.test(user)) {
      if (type === 'root') {
        User.findOne({id: user})
          .populate({
            path: 'myCreation.root',
            populate: {
              path: 'root'
            },
            options: {
              limit: 6,
              skip: 6 * val,
              sort: { date: -1 }
            }
          })
          .populate({
            path: 'myCreation.story',
            populate: {
              path: 'root'
            },
            options: {
              sort: { date: -1 }
            }
          })
          .exec((err, user) => {
            if (err) {
              res.send({permit: false})
            } else {
              if (user) {
                if (user.myCreation.root.length) {   // 存在根节点
                  user.myCreation.root.forEach((root, index, array) => {
                    tool.getRootInfo(root.id, function (count) {
                      rootList.push({
                        root: root.name,
                        count: 1, // 我参与创作的数量
                        timeStamp: root.date.getTime(),
                        data: [root.id],
                        cover: tool.formImg(root.coverImg),
                        nodeCounts: count.nodeCounts,
                        zanCounts: count.zanCounts,
                        readCounts: count.readCounts,
                        label: 'root'
                      })
                      if (user.myCreation.story.length) {
                        for (let i = 0; i < user.myCreation.story.length; i++) {
                          for (let j = 0; j < rootList.length; j++) {
                            if (user.myCreation.story[i].root.name === rootList[j].root) {
                              rootList[j].count ++
                              if (user.myCreation.story[i].date.getTime() > rootList[j].timeStamp) {
                                rootList[j].timeStamp = user.myCreation.story[i].date.getTime()
                              }
                            }
                          }
                        }
                      }
                      if (rootList.length === array.length) {
                        res.send({permit: true, result: bubbleSort(rootList)})
                      }
                    })
                  })
                } else {
                  res.send({permit: true, result: rootList})
                }
              } else {
                res.send({permit: false, type: '404'})
              }
            }
          })
      } else if (type === 'story') {
        User.findOne({id: user})
          .populate({
            path: 'myCreation.story',
            populate: {
              path: 'root'
            },
            options: {
              sort: { date: -1 }
            }
          })
          .populate({
            path: 'myCreation.root'
          })
          .exec((err, user) => {
            if (err) {
              res.send({permit: false})
            } else {
              if (user) {
                if (user.myCreation.story.length) {   // 存在普通故事节点
                  user.myCreation.story.forEach((story, index, array) => {
                    tool.getRootInfo(story.root.id, function (count) {
                      storyList.push({
                        root: story.root ? story.root.name : '',
                        rootId: story.root ? story.root.id : '',
                        id: story.id,
                        timeStamp: story.date.getTime(),
                        cover: tool.formImg(story.root.coverImg),
                        nodeCounts: count.nodeCounts,
                        zanCounts: count.zanCounts,
                        readCounts: count.readCounts,
                        label: 'story'
                      })
                      if (storyList.length === array.length) {
                        let map = {}
                        let dest = []       // 将story归类
                        for (let i = 0; i < storyList.length; i++) {
                          let ai = storyList[i]
                          if (!map[ai.root]) {
                            dest.push({
                              root: ai.root,
                              rootId: ai.rootId,
                              data: [ai.id],
                              cover: ai.cover,
                              nodeCounts: ai.nodeCounts,
                              zanCounts: ai.zanCounts,
                              readCounts: ai.readCounts,
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
                        if (user.myCreation.root.length) {
                          for (let i = 0; i < user.myCreation.root.length; i++) {
                            for (let j = 0; j < dest.length; j++) {
                              if (user.myCreation.root[i].id === dest[j].rootId) {
                                dest.splice(j, 1)
                              }
                            }
                          }
                        }
                        res.send({permit: true, result: bubbleSort(dest)})
                      }
                    })
                  })
                } else {
                  res.send({permit: true, result: rootList})
                }
              }
            }
          })
      }
    } else {
      res.send({permit: false, type: '404'})
    }
  } else {
    res.send({permit: false, type: '404'})
  }
})
router.get('/user/getMyCreationNode', (req, res) => {
  let user = req.query.user
  let root = req.query.root
  let result = {
    user: false,
    id: '',
    rootName: '',
    rootContent: '',
    headImg: '',
    date: '',
    story: []
  }
  let loginUser = req.session.userId || req.cookies.And ? req.cookies.And.userId : undefined
  User.findOne({id: user})
    .populate({
      path: 'myCreation.root',
      options: {
        sort: { date: -1 }
      }
    })
    .populate({
      path: 'myCreation.story',
      populate: {
        path: 'root'
      },
      options: {
        sort: { date: -1 }
      }
    })
    .exec((err, user) => {
      if (err) {
        res.send({error: true, message: '发生错误，请稍后再试', type: 'DB'})
      } else {
        if (user) {
          if (user.myCreation && user.myCreation.root) {
            for (let i = 0; i < user.myCreation.root.length; i++) {
              if (user.myCreation.root[i].name === root) {
                let o = user.myCreation.root[i]
                result.id = o.id
                result.rootName = o.name
                result.rootContent = o.content
                result.coverImg = tool.formImg(o.coverImg)
                result.date = moment(o.date).format('YYYY年M月D日 HH:mm')
                result.user = loginUser === user.id
                result.zan = o.zan ? o.zan.length : 0
                result.writePermit = o.writePermit
                if (user.myCreation && user.myCreation.story) {
                  for (let i = 0; i < user.myCreation.story.length; i++) {
                    if (user.myCreation.story[i].root.name === root) {
                      let o = user.myCreation.story[i]
                      result.story.push({
                        id: o.id,
                        content: o.content,
                        date: moment(o.date).format('YYYY年M月D日 HH:mm'),
                        zan: o.zan ? o.zan.length : 0
                      })
                    }
                  }
                }
              }
            }
            if (!result.id) {
              if (user.myCreation.story) {
                for (let i = 0; i < user.myCreation.story.length; i++) {
                  if (user.myCreation.story[i].root.name === root) {
                    let o = user.myCreation.story[i]
                    result.id = o.root.id
                    result.rootName = o.root.name
                    result.rootContent = o.root.content
                    result.coverImg = tool.formImg(o.root.coverImg)
                    result.date = moment(o.root.date).format('YYYY年M月D日 HH:mm')
                    result.user = false
                    result.zan = o.root.zan ? o.root.zan.length : 0
                    result.story.push({
                      id: o.id,
                      content: o.content,
                      date: moment(o.date).format('YYYY年M月D日 HH:mm'),
                      zan: o.zan ? o.zan.length : 0
                    })
                  }
                }
                res.send({error: false, result: result})
              } else {
                res.send({error: true})
              }
            } else {
              res.send({error: false, result: result})
            }
          } else {
            if (user.myCreation && user.myCreation.story) {
              for (let i = 0; i < user.myCreation.story.length; i++) {
                if (user.myCreation.story[i].root.name === root) {
                  let o = user.myCreation.story[i]
                  result.id = o.root.id
                  result.rootName = o.root.name
                  result.rootContent = o.root.content
                  result.coverImg = tool.formImg(o.root.coverImg)
                  result.date = moment(o.root.date).format('YYYY年M月D日 HH:mm')
                  result.user = false
                  result.zan = o.root.zan ? o.root.zan.length : 0
                  result.story.push({
                    id: o.id,
                    content: o.content,
                    date: moment(o.date).format('YYYY年M月D日 HH:mm'),
                    zan: o.zan ? o.zan.length : 0
                  })
                }
              }
              res.send({error: false, result: result})
            } else {
              res.send({error: true})
            }
          }
        } else {
          res.send({error: true, message: '找不到资源', type: 'user'})
        }
      }
    })
})
router.post('/user/changeMark', (req, res) => {
  let markActive = req.body.markActive
  let id = req.body.id
  let mark = {
    id: id
  }
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  if (user) {
    if (markActive) {
      User.findOne({username: user})
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误'})
          } else {
            if (doc && doc.mark) {
              doc.mark.forEach((item, index) => {
                if (item.id === mark.id) {
                  doc.mark.splice(index, 1)
                }
              })
              doc.mark.push(mark)
              User.updateOne({username: user}, {$set: {mark: doc.mark}})
                .exec(err2 => {
                  if (err2) {
                    res.send({error: true, type: 'DB', message: '发生错误'})
                  } else {
                    res.send({error: false})
                  }
                })
            } else {
              res.send({error: true, type: 'DB', message: '发生错误'})
            }
          }
        })
    } else {
      User.findOne({username: user})
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误'})
          } else {
            if (doc && doc.mark) {
              doc.mark.forEach((item, index) => {
                if (item.id === mark.id) {
                  doc.mark.splice(index, 1)
                }
              })
              User.updateOne({username: user}, {$set: {mark: doc.mark}})
                .exec(err2 => {
                  if (err2) {
                    res.send({error: true, type: 'DB', message: '发生错误'})
                  } else {
                    res.send({error: false})
                  }
                })
            } else {
              res.send({error: true, type: 'DB', message: '发生错误'})
            }
          }
        })
    }
  } else {
    res.send({error: true, type: 'value', message: '请登录后再试'})
  }
})
router.get('/user/getMark', (req, res) => {
  let id = req.query.id
  let markExist = false
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({username: user})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误'})
        } else {
          if (doc && doc.mark) {
            markExist = doc.mark.some(item => {
              return item.id === id
            })
          } else {
            markExist = false
          }
          res.send({error: false, mark: markExist})
        }
      })
  } else {
    res.send({error: false, mark: false})
  }
})

router.post('/user/addFocus', (req, res) => {
  let userId = req.body.userId
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({id: userId})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, message: '关注失败', type: 'DB'})
        } else {
          if (doc) {
            User.findOneAndUpdate({username: user}, {$addToSet: {'focus': doc._id}})
              .exec((err2, doc2) => {
                if (err2) {
                  res.send({error: true, message: '关注失败', type: 'DB'})
                } else {
                  User.updateOne({id: userId}, {$addToSet: {'follower': doc2._id}})
                    .exec(err3 => {
                      if (!err3) {
                        res.send({error: false, message: '关注成功'})
                      }
                    })
                }
              })
          } else {
            res.send({error: true, message: '关注失败', type: 'value'})
          }
        }
      })
  } else {
    res.send({error: true, message: '登录后才可进行操作', type: 'login'})
  }
})
router.post('/user/cancelFocus', (req, res) => {
  let userId = req.body.userId
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({id: userId})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, message: '取消关注失败', type: 'DB'})
        } else {
          if (doc) {
            User.findOneAndUpdate({username: user}, {$pull: {'focus': doc._id}})
              .exec((err2, doc2) => {
                if (err2) {
                  res.send({error: true, message: '取消关注失败', type: 'DB'})
                } else {
                  User.updateOne({id: userId}, {$pull: {'follower': doc2._id}})
                    .exec(err3 => {
                      if (!err3) {
                        res.send({error: false, message: '取消关注成功'})
                      }
                    })
                }
              })
          } else {
            res.send({error: true, message: '取消关注失败', type: 'value'})
          }
        }
      })
  } else {
    res.send({error: true, message: '登录后才可进行操作', type: 'login'})
  }
})
router.post('/user/addDepth', (req, res) => {
  let fid = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  async function getRootObj () {
    return new Promise((resolve, reject) => {
      if (rootReg.test(fid)) {
        Root.findOne({id: fid})
          .exec((err, root) => {
            if (err) {
              console.log(err)
            }
            if (root) {
              resolve(root)
            } else {
              reject(null)
            }
          })
      } else if (storyReg.test(fid)) {
        Story.findOne({id: fid})
          .exec((err, story) => {
            if (err) {
              console.log(err)
            }
            if (story) {
              Root.findOne({_id: story.root})
                .exec((err, root) => {
                  if (err) {
                    console.log(err)
                  }
                  if (root) {
                    resolve(root)
                  } else {
                    reject(null)
                  }
                })
            } else {
              reject(null)
            }
          })
      } else {
        reject(null)
      }
    })
  }
  User.findOne({username: user})
    .populate('depth.rootId')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (doc) {
        (async function () {
          let tempDoc = doc.depth
          let root = await getRootObj()
          if (tempDoc.length > 0) {
            if (tempDoc.some(function (item) {
              return item.rootId.id === root.id
            })) {
              tempDoc.forEach(item => {
                if (item.rootId.id === root.id) {
                  if (item.storyId.some(function (it) {
                    return it === fid
                  })) {
                    item.latest = fid
                  } else {
                    item.storyId.push(fid)
                    item.latest = fid
                  }
                }
              })
            } else {
              tempDoc.push({
                rootId: root._id,
                storyId: [fid],
                latest: fid
              })
            }
          } else {
            tempDoc.push({
              rootId: root._id,
              storyId: [fid],
              latest: fid
            })
          }
          User.updateOne({username: user}, {$set: {'depth': tempDoc}})
            .exec((err2) => {
              if (err2) {
                res.send({error: true})
              } else {
                res.send({error: false})
              }
            })
        })()
      } else {
        res.send({error: false})
      }
    })
})
// router.post('/user/buildHistory', (req, res) => {  // 修复数据
//   let user
//   if (req.session.user) {
//     user = req.session.user
//   } else if (req.cookies.And) {
//     user = req.cookies.And.user
//   }
//   let result = []
//   let storyResult = []
//   User.findOne({username: user})
//     .exec((err, doc) => {
//       if (err) {
//         console.log(err)
//       } else {
//         let id = doc._id
//         console.log(id)
//         Root.find({author: id})
//           .exec((err2, root) => {
//             if (err2) {
//               console.log(err2)
//             } else {
//               root.forEach(item => {
//                 result.push(
//                   item._id
//                 )
//               })
//               Story.find({author: id})
//                 .exec((err3, story) => {
//                   if (err3) {
//                     console.log(err3)
//                   } else {
//                     story.forEach(item => {
//                       storyResult.push(item._id)
//                     })
//                     console.log(storyResult)
//                     console.log(result)
//                     User.updateOne({username: user}, {$set: {'myCreation.root': result, 'myCreation.story': storyResult}})
//                       .exec(err3 => {
//                         if (err3) {
//                           console.log(err3)
//                         } else {
//                           res.send('yes')
//                         }
//                       })
//                   }
//                 })
//             }
//           })
//       }
//     })
// })

router.post('/user/getUserByName', (req, res) => {
  User.findOne({nickname: req.body.name})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        if (doc) {
          res.send({error: false, id: doc.id})
        } else {
          res.send({error: true, type: 'User', message: '发生错误'})
        }
      }
    })
})
router.post('/user/getSearchPeople', (req, res) => {
  User.findOne({nickname: req.body.content})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        if (doc) {
          res.send({error: false, path: `/people/${doc.id}`})
        } else {
          res.send({error: true, type: 'user', message: '发生错误'})
        }
      }
    })
})
router.post('/user/getSearchTitle', (req, res) => {
  Root.findOne({name: req.body.content})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        if (doc) {
          res.send({error: false, path: `/story/${doc.id}`})
        } else {
          res.send({error: true, type: 'user', message: '发生错误'})
        }
      }
    })
})
router.post('/user/addSearchHistory', (req, res) => {
  let content = req.body.content
  let active = req.body.active
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({username: user})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, type: 'DB'})
        } else {
          if (doc) {
            doc.searchHistory.forEach((item, index) => {
              if (item.content === content && item.style === active) {
                doc.searchHistory.splice(index, 1)
              }
            })
            if (doc.searchHistory.length <= 10) {
              doc.searchHistory.push({
                content: content,
                style: active
              })
              res.cookie('AndSH', {sh: doc.searchHistory}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
              User.updateOne({username: user}, {$set: {searchHistory: doc.searchHistory}})
                .exec(err2 => {
                  if (!err2) {
                    res.send({error: false})
                  } else {
                    res.send({error: true, type: 'DB'})
                  }
                })
            } else {
              doc.searchHistory.reverse().pop()
              doc.searchHistory.reverse()
              doc.searchHistory.push({
                content: content,
                style: active
              })
              res.cookie('AndSH', {sh: doc.searchHistory}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
              User.updateOne({username: user}, {$set: {searchHistory: doc.searchHistory}})
                .exec(err2 => {
                  if (!err2) {
                    res.send({error: false})
                  } else {
                    res.send({error: true, type: 'DB'})
                  }
                })
            }
          } else {
            res.send({error: true, type: 'user'})
          }
        }
      })
  } else {
    if (req.cookies.ANDSH) {
      if (req.cookies.ANDSH.sh.length <= 10) {
        req.cookies.ANDSH.sh.push({
          content: content,
          style: active
        })
        res.cookie('AndSH', {sh: req.cookies.ANDSH.sh}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
      } else {
        req.cookies.ANDSH.sh.reverse().pop()
        req.cookies.ANDSH.sh.reverse()
        req.cookies.ANDSH.sh.push({
          content: content,
          style: active
        })
        res.cookie('AndSH', {sh: req.cookies.ANDSH.sh}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
      }
    }
  }
})
router.post('/user/deleteSearchHistory', (req, res) => {
  let content = req.body.content
  let style = req.body.style
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({username: user})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, type: 'DB'})
        } else {
          if (doc) {
            doc.searchHistory.forEach((his, index) => {
              if (his.content === content && his.style === style) {
                doc.searchHistory.splice(index, 1)
              }
            })
            User.updateOne({username: user}, {$set: {searchHistory: doc.searchHistory}})
              .exec(err2 => {
                if (err2) {
                  res.send({error: true, type: 'user'})
                } else {
                  res.cookie('AndSH', {sh: doc.searchHistory}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
                  res.send({error: false, history: doc.searchHistory})
                }
              })
          } else {
            res.send({error: true, type: 'user'})
          }
        }
      })
  } else {
    if (req.cookies.ANDSH) {
      req.cookies.ANDSH.forEach((sh, i) => {
        if (sh.content === content && sh.style === style) {
          req.cookies.ANDSH.splice(i, 1)
          res.cookie('AndSH', {sh: req.cookies.ANDSH}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
          res.send({error: false, history: req.cookies.ANDSH})
        }
      })
      res.send({error: false})
    }
  }
})
router.get('/user/getSearchHistory', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({username: user}, (err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB'})
      } else {
        if (doc) {
          res.send({error: false, history: doc.searchHistory})
        } else {
          res.send({error: true, type: 'user', message: '发生错误，请尝试重新登录'})
        }
      }
    })
  } else {
    if (req.cookies.ANDSH) {
      res.send({error: false, history: req.cookies.ANDSH.sh})
    } else {
      res.send({error: false, history: []})
    }
  }
})
router.post('/user/changeFontSize', (req, res) => {
  let user
  let value = req.body.value
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.updateOne({username: user}, {$set: {'fontSize': value}})
      .exec(err => {
        if (err) {
          res.send({error: true, type: 'auth', message: ''})
        } else {
          res.send({error: false})
        }
      })
  } else {
    res.send({error: true, type: 'auth', message: '请登录后再试'})
  }
})
router.get('/user/getFontSize', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.findOne({username: user})
      .exec((err, doc) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          if (doc) {
            res.send({error: false, size: doc.fontSize})
          }
        }
      })
  } else {
    res.send({error: false, size: '正常'})
  }
})
router.get('/user/getSettings', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let settings = {}
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          settings.fontSize = doc.fontSize
          res.send({error: false, settings: settings})
        } else {
          res.send({error: false, settings: {fontSize: '正常'}})
        }
      }
    })
})
router.post('/user/clearSearchHistory', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    User.updateOne({username: user}, {$set: {searchHistory: []}}, (err) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        res.cookie('AndSH', {sh: []}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
        res.send({error: false})
      }
    })
  } else {
    res.cookie('AndSH', {sh: []}, { expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), httpOnly: true })
    res.send({error: false})
  }
})
router.get('/user/getSubscribeMessage', (req, res) => {
  let user
  let result = []
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .populate('subscribe.root')
    .populate('subscribe.new.id')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
      } else {
        for (let i = 0; i < doc.subscribe.length; i++) {
          let count = 0
          let temp = []
          for (let j = 0; j < doc.subscribe[i].new.length; j++) {
            if (!doc.subscribe[i].new[j].readed) {
              count++
              temp.push(doc.subscribe[i].new[j])
            }
          }
          temp.reverse()    // 倒序
          result.push({
            id: doc.subscribe[i].root.id,
            name: doc.subscribe[i].root.name,
            words: temp.length ? temp[0].id.content : doc.subscribe[i].new[doc.subscribe[i].new.length - 1].id.content,
            notReaded: count,
            date: temp.length ? moment(temp[0].id.date).fromNow() : moment(doc.subscribe[i].new[doc.subscribe[i].new.length - 1].id.date).fromNow()
          })
        }
        res.send({error: false, result: result})
      }
    })
})
router.get('/user/getRs', (req, res) => {
  let id = req.query.id
  let user
  let temp = []
  let result = []
  let notReaded = []
  let readed = []
  function bubbleSort (arr) {   // 排序算法，从大到小
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
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .populate('subscribe.root')
    .populate('subscribe.new.id')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
      } else {
        for (let i = 0; i < doc.subscribe.length; i++) {
          if (doc.subscribe[i].root.id === id) {
            for (let j = 0; j < doc.subscribe[i].new.length; j++) {
              temp.push({
                title: doc.subscribe[i].root.name,
                storyId: doc.subscribe[i].new[j].id._id,
                rootId: doc.subscribe[i].root._id,
                id: doc.subscribe[i].new[j].id.id,
                content: doc.subscribe[i].new[j].id.content,
                zan: doc.subscribe[i].new[j].id.zan ? doc.subscribe[i].new[j].id.zan.length : 0,
                date: moment(doc.subscribe[i].new[j].id.date).format('lll'),
                readed: doc.subscribe[i].new[j].readed,
                timeStamp: doc.subscribe[i].new[j].id.date.getTime()
              })
            }
          }
        }
        temp.forEach(item => {
          if (item.readed) {
            readed.push(item)
          } else {
            notReaded.push(item)
          }
        })
        bubbleSort(notReaded)
        bubbleSort(readed)
        result = notReaded.concat(readed)
        res.send({error: false, result: result})
      }
    })
})
router.post('/user/changeReadState', (req, res) => {
  let user
  const storyId = req.body.id
  const rootId = req.body.rootId
  let temp
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .populate('subscribe.root')
    .populate('subscribe.new.id')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          temp = doc.subscribe
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].root._id.toString() === rootId.toString()) {
              for (let j = 0; j < temp[i].new.length; j++) {
                if (temp[i].new[j].id._id.toString() === storyId.toString()) {
                  temp[i].new[j].readed = true
                }
              }
            }
          }
          console.log(JSON.stringify(temp))
          User.updateOne({username: user}, {$set: {'subscribe': temp}})
            .exec(err2 => {
              if (err2) {
                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
              } else {
                res.send({error: false})
              }
            })
        }
      }
    })
})
router.get('/user/getPromoteState', (req, res) => {
  let user
  let flag = false
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let result = {
    comment: false,
    subscribe: false,
    friend: false
  }
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: false, message: '发生错误，请稍后再试'})
      } else {
        result.comment = doc.commentFrom.some(function (item) {    // 评论消息
          return !item.readed
        })
        for (let i = 0; i < doc.subscribe.length; i++) {
          if (!flag) {
            for (let j = 0; j < doc.subscribe[i].new.length; j++) {   // 订阅消息
              if (!doc.subscribe[i].new[j].readed) {
                result.subscribe = true
                flag = true
                break
              }
            }
          } else {
            break
          }
        }
        result.friend = doc.promote.some(function (item) {  // 好友消息
          return !item.readed
        })
        res.send({error: false, result: result})
      }
    })
})
router.get('/user/getAnnouncement', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let temp
  let result = []
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
      } else {
        if (doc.announcement.length) {
          temp = doc.announcement
          for (let i = 0; i < doc.announcement.length; i++) {
            result.push({
              title: doc.announcement[i].title,
              content: doc.announcement[i].content,
              date: moment(doc.announcement[i].date).format('lll'),
              img: tool.formImg(doc.announcement[i].img)
            })
          }
          temp.forEach(item => {
            item.readed = true
          })
          result.reverse()
          User.updateOne({username: user}, {$set: {'announcement': temp}})
            .exec(err2 => {
              if (err2) {
                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
              } else {
                res.send({error: false, result: result})
              }
            })
        } else {
          res.send({error: false, result: []})
        }
      }
    })
})
router.get('/user/getMessageWords', (req, res) => {
  console.log('进入')
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let result = []
  User.findOne({username: user})
    .populate({
      path: 'dialogue',
      populate: {
        path: 'people1'
      }
    })
    .populate({
      path: 'dialogue',
      populate: {
        path: 'people2'
      }
    })
    .populate({
      path: 'dialogue',
      populate: {
        path: 'message'
      }
    })
    .populate({
      path: 'dialogue',
      populate: {
        path: 'message',
        populate: {
          path: 'to'
        }
      }
    })
    .populate({
      path: 'dialogue',
      populate: {
        path: 'message',
        populate: {
          path: 'from'
        }
      }
    })
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误, 请稍后再试'})
      } else {
        if (doc) {
          for (let i = 0; i < doc.dialogue.length; i++) {
            console.log('喜欢' + doc.dialogue)
            let count = 0
            let temp = []
            for (let j = 0; j < doc.dialogue[i].message.length; j++) {
              if (doc.dialogue[i].message[j].to.username === user && !doc.dialogue[i].message[j].readed) {
                count++
                temp.push({
                  to: doc.dialogue[i].message[j].to.nickname,
                  from: doc.dialogue[i].message[j].from.nickname,
                  content: doc.dialogue[i].message[j].content
                })
                temp.reverse()
              }
            }
            if (doc.dialogue[i].people1.username === user) {
              result.push({
                peopleId: doc.dialogue[i].people2.id,
                headImg: tool.formImg(doc.dialogue[i].people2.headImg),
                words: temp[0].content,
                notReaded: count,
                date: moment(temp[0].date).fromNow()
              })
            } else {
              result.push({
                peopleId: doc.dialogue[i].people1.id,
                headImg: tool.formImg(doc.dialogue[i].people1.headImg),
                words: temp[0].content,
                notReaded: count,
                date: moment(temp[0].date).fromNow()
              })
            }
            res.send({error: false, result: result})
          }
        } else {
          res.send({error: true, type: 'db', message: '发生错误, 请重新登录'})
        }
      }
    })
})
module.exports = router
