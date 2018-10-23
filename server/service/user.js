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
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (user) {
        for (let i = 0; i < user.subscribe.length; i++) {
          let sub = user.subscribe
          result.push({
            id: sub[i].id,
            name: sub[i].name,
            follower: sub[i].subscribe ? sub[i].subscribe.length : 0,
            coverImg: tool.formImg(sub[i].coverImg)
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
        res.send({error: false, user: duser.id})
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
  let result = []
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .exec((err, user) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (user) {
          for (let i = 0; i < user.promote.length; i++) {
            result.push({
              id: user.promote[i]._id,
              content_1: user.promote[i].content_1,
              content_2: user.promote[i].content_2,
              content_3: user.promote[i].content_3,
              content_4: user.promote[i].content_4,
              description: user.promote[i].description,
              date: moment(user.promote[i].date).fromNow(),
              vis: true
            })
          }
          res.send({error: false, result: result})
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
        res.send({error: false, nickname: doc.nickname, sex: doc.sex, birthday: moment(doc.birthday).format('L'), sign: doc.sign})
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

// 需要修改
router.post('/user/changeMark', (req, res) => {
  let rootReg = /^R([0-9]){7}$/
  let storyReg = /^S([0-9]){7}$/
  let markActive = req.body.markActive
  let id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  if (user) {
    if (rootReg.test(id)) {
      Root.findOne({id: id}, (err1, root) => {
        if (err1) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          if (root) {
            let content = root.content
            let brief = []
            if (content.length >= 30) {
              brief = content.slice(0, 30)
            } else {
              brief = content
            }
            User.findOne({username: user})
              .exec((err2, duser) => {
                if (err2) {
                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  if (duser) {
                    if (duser.mark.length > 0) {
                      let markData
                      let flag
                      for (let i = 0; i < duser.mark.length; i++) {
                        if (duser.mark[i] && duser.mark[i].rootId === id) {
                          flag = true
                          if (markActive) {
                            duser.mark[i].story.push({
                              id: id,
                              brief: brief
                            })
                            markData = duser.mark[i]
                          } else {
                            if (duser.mark[i] && duser.mark[i].story) {
                              for (let j = 0; j < duser.mark[i].story.length; j++) {
                                if (duser.mark[i].story[j].id === id) {
                                  duser.mark[i].story.splice(j, 1)
                                  break
                                }
                              }
                            }
                            markData = duser.mark[i]
                          }
                          break
                        } else {
                          if (i === duser.mark.length - 1 && markActive) {
                            let k =
                              {
                                rootId: id,
                                story: [{
                                  id: id,
                                  brief: brief
                                }]
                              }
                            User.updateOne({username: user}, {$addToSet: {'mark': k}})
                              .exec((err3) => {
                                if (err3) {
                                  console.log(err3)
                                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                } else {
                                  res.send({error: false})
                                }
                              })
                          }
                        }
                      }
                      if (flag) {
                        User.updateOne({$and: [{username: user}, {'mark.rootId': id}]}, {$addToSet: {'mark': markData}})
                          .exec((err4) => {
                            if (err4) {
                              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                            } else {
                              res.send({error: false})
                            }
                          })
                      }
                    } else {
                      if (markActive) {
                        let k =
                          {
                            rootId: id,
                            story: [{
                              id: id,
                              brief: brief
                            }]
                          }
                        User.updateOne({username: user}, {$addToSet: {'mark': k}})
                          .exec((err5) => {
                            if (err5) {
                              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                            } else {
                              res.send({error: false})
                            }
                          })
                      } else {
                        // 这种情况是有问题的，但用户并无影响。查开发手册
                        res.send({error: false})
                      }
                    }
                  }
                }
              })
          } else {
            res.send({error: true, type: 'value', message: '数据错误'})
          }
        }
      })
    } else if (storyReg.test(id)) {
      Story.findOne({id: id})
        .populate('root')
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            if (doc) {
              let rId = doc.root.id
              let content = doc.content
              let brief = []
              if (content.length >= 30) {
                brief = content.slice(0, 30)
              } else {
                brief = content
              }
              User.findOne({username: user})
                .exec((err3, duser) => {
                  if (err3) {
                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                  } else {
                    if (duser) {
                      if (duser.mark.length) {
                        let markData = []
                        let flag
                        for (let i = 0; i < duser.mark.length; i++) {
                          if (duser.mark[i] && duser.mark[i].rootId === rId) {
                            flag = true
                            if (markActive) {
                              duser.mark[i].story.push({
                                id: id,
                                brief: brief
                              })
                              markData.push(duser.mark[i])
                            } else {
                              console.log('查询到的' + duser.mark[i])
                              if (duser.mark[i] && duser.mark[i].story) {
                                for (let j = 0; j < duser.mark[i].story.length; j++) {
                                  if (duser.mark[i].story[j].id === id) {
                                    duser.mark[i].story.splice(j, 1)
                                    break
                                  }
                                }
                              }
                              markData.push(duser.mark[i])
                            }
                            break
                          } else {
                            if (i === duser.mark.length - 1 && markActive) {
                              let k =
                                {
                                  rootId: rId,
                                  story: {
                                    id: id,
                                    brief: brief
                                  }
                                }
                              User.updateOne({username: user}, {$addToSet: {'mark': k}})
                                .exec((err3) => {
                                  if (err3) {
                                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                  } else {
                                    res.send({error: false})
                                  }
                                })
                            }
                          }
                        }
                        if (flag) {
                          User.updateOne({$and: [{username: user}, {'mark.rootId': rId}]}, {$set: {'mark': markData}})
                            .exec((err2) => {
                              if (err2) {
                                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                              } else {
                                res.send({error: false})
                              }
                            })
                        }
                      } else {
                        if (markActive) {
                          let k =
                            {
                              rootId: rId,
                              story: {
                                id: id,
                                brief: brief
                              }
                            }
                          User.updateOne({username: user}, {$addToSet: {'mark': k}})
                            .exec((err3) => {
                              if (err3) {
                                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                              } else {
                                res.send({error: false})
                              }
                            })
                        } else {
                          // 这种情况是有问题的，但用户并无影响。查开发手册
                          res.send({error: false})
                        }
                      }
                    } else {
                      res.send({error: true, type: 'value', message: '数据错误，请尝试重新登录'})
                    }
                  }
                })
            } else {
              res.send({error: true, type: 'value', message: '数据错误，请尝试重新登录'})
            }
          }
        })
    }
  } else {
    res.send({error: true, type: 'value', message: '数据错误'})
  }
})
router.get('/user/getMark', (req, res) => {
  let id = req.query.id
  const rootReg = /^R([0-9]){7}$/
  const storyReg = /^S([0-9]){7}$/
  let result = []
  let markExist = false
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  if (user) {
    if (rootReg.test(id)) {
      User.findOne({username: user})
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            if (doc) {
              if (doc.mark.length) {
                doc.mark.forEach((mark) => {
                  if (mark.rootId === id) {
                    markExist = mark.story.some(function (sid) {
                      return sid.id === id
                    })
                    result = mark
                  }
                })
                res.send({error: false, result: result, mark: markExist, root: id})
              } else {
                res.send({error: false, result: [], mark: markExist, root: id})
              }
            } else {
              res.send({error: true, type: 'user', message: '发生错误，请尝试重新登录'})
            }
          }
        })
    } else if (storyReg.test(id)) {
      Story.findOne({id: id})
        .populate('root')
        .exec((err, story) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            if (story) {
              let rId = story.root.id
              User.findOne({username: user})
                .exec((err, doc) => {
                  if (err) {
                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                  } else {
                    if (doc) {
                      if (doc.mark.length) {
                        doc.mark.forEach((mark) => {
                          if (mark.rootId === rId) {
                            markExist = mark.story.some(function (sid) {
                              return sid.id === id
                            })
                            result = mark
                          }
                        })
                        res.send({error: false, result: result, mark: markExist, root: rId})
                      } else {
                        res.send({error: false, result: [], mark: markExist, root: rId})
                      }
                    } else {
                      res.send({error: true, type: 'user', message: '发生错误，请尝试重新登录'})
                    }
                  }
                })
            } else {
              res.send({error: true, type: 'value', message: '数据错误'})
            }
          }
        })
    }
  } else {
    res.send({error: false, result: 'notShow'})
  }
})
router.post('/user/changeMarkInfo', (req, res) => {
  const rootReg = /^R([0-9]){7}$/
  const storyReg = /^S([0-9]){7}$/
  let id = req.body.id
  let value = req.body.value
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    user = req.cookies.And.user
  }
  if (user) {
    if (rootReg.test(id)) {
      User.findOne({$and: [{'username': user}, {'mark.rootId': id}]})
        .exec((err, doc) => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            let obj = doc.mark
            for (let i = 0; i < obj.length; i++) {
              if (obj[i].rootId === id) {
                for (let j = 0; j < obj[i].story.length; j++) {
                  if (obj[i].story[j].id === id) {
                    obj[i].story[j].name = value // 修改书签名
                    break
                  }
                }
              }
            }
            User.updateOne({$and: [{'username': user}, {'mark.rootId': id}]}, {$set: {'mark': obj}})
              .exec((err2) => {
                if (err2) {
                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  res.send({error: false, message: '修改成功'})
                }
              })
          }
        })
    } else if (storyReg.test(id)) {
      Story.findOne({id: id})
        .populate('root')
        .exec((err, story) => {
          if (err) {
            res.send({error: false, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            User.findOne({$and: [{'username': user}, {'mark.rootId': story.root.id}]})
              .exec((err, doc) => {
                if (err) {
                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  let obj = doc.mark
                  for (let i = 0; i < obj.length; i++) {
                    if (obj[i].rootId === story.root.id) {
                      for (let j = 0; j < obj[i].story.length; j++) {
                        if (obj[i].story[j].id === id) {
                          obj[i].story[j].name = value // 修改书签名
                          break
                        }
                      }
                    }
                  }
                  User.updateOne({$and: [{'username': user}, {'mark.rootId': story.root.id}]}, {$set: {'mark': obj}})
                    .exec((err2) => {
                      if (err2) {
                        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                      } else {
                        res.send({error: false, message: '修改成功'})
                      }
                    })
                }
              })
          }
        })
    } else {
      res.send({error: true, type: 'value', message: '数据错误'})
    }
  } else {
    res.send({error: true, type: 'user', message: '发生错误，请尝试重新登录'})
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
router.post('/user/addHistory', (req, res) => {
  let id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  const rootReg = /^R([0-9]){7}$/
  const storyReg = /^S([0-9]){7}$/
  let now = new Date()
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  let history
  async function getRootId () {
    return new Promise((resolve, reject) => {
      if (rootReg.test(id)) {
        Root.findOne({id: id})
          .exec((err, root) => {
            if (err) {
              console.log(err)
            }
            if (root) {
              resolve(root._id)
            } else {
              reject(null)
            }
          })
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .populate('root')
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
                    resolve(root._id)
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
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
      } else {
        if (doc) {
          if (doc.history && doc.history.length) {
            if (doc.history[doc.history.length - 1].date.getTime() === today.getTime()) { // 当前记录中最新的项目是否是今天
              (async function () {
                let tempHistory = doc.history
                let newHistory = tempHistory[tempHistory.length - 1]
                let rootId = await getRootId()
                let flag2 = false
                for (let i = 0; i < newHistory.rootPack.length; i++) {
                  if (newHistory.rootPack[i].rootId.toString() === rootId.toString()) {
                    flag2 = true
                    let flag = false
                    newHistory.rootPack[i].story.forEach((item, index) => {
                      if (item.storyId === id) {
                        item.date = now
                        newHistory.rootPack[i].update = now
                        flag = true
                      }
                      if (!flag && index === newHistory.rootPack[i].story.length - 1) {
                        newHistory.rootPack[i].story.push({
                          storyId: id,
                          date: now
                        })
                        newHistory.rootPack[i].update = now
                      }
                    })
                  }
                  if (!flag2 && i === newHistory.rootPack.length - 1) {
                    newHistory.rootPack.push({
                      rootId: rootId,
                      story: [{
                        storyId: id,
                        date: now
                      }],
                      update: now
                    })
                  }
                }
                tempHistory[tempHistory.length - 1] = newHistory
                User.updateOne({username: user}, {$set: {'history': tempHistory}})
                  .exec((err2) => {
                    if (err2) {
                      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                    } else {
                      res.send({error: false})
                    }
                  })
              })()
            } else {
              (async function () {
                let tempHistory = doc.history
                let rootId = await getRootId()
                tempHistory.push({
                  date: today,
                  rootPack: [
                    {
                      rootId: rootId,
                      story: [{
                        storyId: id,
                        date: now
                      }],
                      update: now
                    }
                  ]
                })
                User.updateOne({username: user}, {$set: {'history': tempHistory}})
                  .exec((err3) => {
                    if (err3) {
                      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                    } else {
                      res.send({error: false})
                    }
                  })
              })()
            }
          } else {
            (async function () {
              history = [{
                date: today,
                rootPack: [
                  {
                    rootId: await getRootId(),
                    story: [{
                      storyId: id,
                      date: now
                    }],
                    update: now
                  }
                ]
              }]
              User.updateOne({username: user}, {$set: {'history': history}})
                .exec((err2) => {
                  if (err2) {
                    res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
                  } else {
                    res.send({error: false})
                  }
                })
            })()
          }
        } else {
          res.send({error: true, type: 'value', message: '发生错误，请尝试重新登录'})
        }
      }
    })
})
router.get('/user/getHistory', (req, res) => {
  let id = req.query.id
  let val = req.query.val
  let result = []
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  function bubbleSort (arr) {   // 排序算法，从大到小
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].updateTime.getTime() < arr[j + 1].updateTime.getTime()) {
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    return arr
  }
  function dateBubbleSort (arr) {   // 排序算法，从大到小
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].time.getTime() < arr[j + 1].time.getTime()) {
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    return arr
  }
  let now = new Date()
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  User.findOne({id: id})
    .populate('history.rootPack.rootId')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (doc && doc.username === user) {
        let beginNumber = doc.history.length - 1 - 3 * val
        let endNumber = doc.history.length - 3 * val - 3
        if (endNumber < 0) {
          endNumber = 0
        }
        for (let i = beginNumber; i >= endNumber; i--) {
          let m = beginNumber - i
          if (doc.history[i].date.getTime() === today.getTime()) {
            result.push({
              date: '今天',
              rootPack: []
            })
          } else {
            result.push({
              date: moment(doc.history[i].date).fromNow(),
              rootPack: []
            })
          }
          for (let j = 0; j < doc.history[i].rootPack.length; j++) {
            result[m].rootPack[j] = {
              rootId: doc.history[i].rootPack[j].rootId.name,
              coverImg: tool.formImg(doc.history[i].rootPack[j].rootId.coverImg),
              story: [],
              update: moment(doc.history[i].rootPack[j].update).format('HH:mm'),
              updateTime: doc.history[i].rootPack[j].update,
              showList: false
            }
            for (let k = 0; k < doc.history[i].rootPack[j].story.length; k++) {
              result[m].rootPack[j].story[k] = {
                storyId: doc.history[i].rootPack[j].story[k].storyId,
                date: moment(doc.history[i].rootPack[j].story[k].date).fromNow(),
                time: doc.history[i].rootPack[j].story[k].date
              }
            }
            dateBubbleSort(result[m].rootPack[j].story)
          }
          bubbleSort(result[m].rootPack)
        }
        res.send({error: false, result: result})
      } else {
        if (typeof id === 'undefined') {
          res.send({error: false, result: []})
        } else {
          res.send({error: true, type: 'auth', message: '发生错误'})
        }
      }
    })
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
                } else {
                  tempDoc.push({
                    rootId: root._id,
                    storyId: [fid],
                    latest: fid
                  })
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
module.exports = router
