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
  User.findOne({id: fromId}, (err, fromUser) => {
    if (err) {
      res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
    }
    User.findOne({id: id}, (err2, user) => {
      if (err2) {
        res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
      }
      if (!user.friendList.some(function (item) {
        return item.friend.toString() === fromUser._id.toString()
      })) {
        console.log('查询到好友列表不存在')
        // 更新自己好友列表
        User.updateOne({$and: [{id: id}, {'pending.addFriend.from': fromUser._id}]}, {
          $push: {'friendList': {'friend': fromUser._id}},
          $set: {'pending.addFriend.$.state': 'resolve'}
        }, {upsert: true}, (error) => {
          if (error) {
            res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
          }
          // 更新对方的好友列表
          User.updateOne({$and: [{id: fromId}, {'pending.request.to': user._id}]}, {
            $push: {
              'friendList': {'friend': user._id},
              'promote': {'description': 'friendRequest', 'content_1': user.nickname, 'content_2': '接受了您的好友请求'}
            },
            $pull: {'pending.request': {'to': user._id}}
          }, {upsert: true}, (error2) => {
            if (error2) {
              console.log(error2)
              res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
            } else {
              res.send({error: false, message: '操作成功'})
            }
          })
        })
      } else {
        console.log('存在')
        // 更新对方的好友列表
        User.updateOne({$and: [{id: fromId}, {'pending.request.to': user._id}]}, {
          $push: {
            'friendList': {'friend': user._id},
            'promote': {'description': 'friendRequest', 'content_1': user.nickname, 'content_2': '接受了您的好友请求'}
          },
          $pull: {'pending.request': {'to': user._id}}
        }, {upsert: true}, (error2) => {
          if (error2) {
            console.log(error2)
            res.send({error: true, type: 'DB', message: '发生错误请稍后再试'})
          } else {
            res.send({error: false, message: '操作成功'})
          }
        })
      }
    })
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
router.get('/user/getUserFriendship', (req, res) => {
  let loginUser
  if (req.session.user) {
    loginUser = req.session.user
  } else if (req.cookies.And && req.cookies.And.user) {
    loginUser = req.cookies.And.user
  }
  User.findOne({id: req.query.user}, (err, user) => {  // 查询目标
    if (err) {
      console.log(err)
      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
    } else {
      if (user && loginUser) {
        User.findOne({username: loginUser}, (err2, me) => {
          if (err2) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            let cond1 = user.friendList.some(function (item) {
              return item.friend.toString() === me._id.toString()
            })
            let cond2 = me.friendList.some(function (item) {
              return item.friend.toString() === user._id.toString()
            })
            res.send({error: false, cond1: cond1, cond2: cond2})
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
      User.updateOne({username: loginUser}, {$pull: {'friendList': {'friend': user._id}}})
        .exec(err2 => {
          if (err2) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            res.send({error: false, message: '删除成功'})
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
    .populate()
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
          let hello = ['阿北山', '龙儿', 'h', 'a', 6, '牛', 'd', 'f']
          console.log(hello.sort())
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
router.post('/user/changeBirthday', (req, res) => {
  'use strict'
  let id = req.body.id
  let date = req.body.date
  if (req.session.userId === id || (req.cookies.And && req.cookies.And.userId === id)) {
    User.updateOne({id: id}, {$set: {'birthday': date}})
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
  let id = req.body.id
  let value = req.body.value
  if (req.session.userId === id || (req.cookies.And && req.cookies.And.userId === id)) {
    User.updateOne({id: id}, {$set: {'sex': value}}, {upsert: true})
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
  // function bubbleSort (arr) {   // 排序算法
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     for (let j = 0; j < arr.length - 1 - i; j++) {
  //       if (arr[j]['timeStamp'] < arr[j + 1]['timeStamp']) {
  //         let tmp = arr[j]
  //         arr[j] = arr[j + 1]
  //         arr[j + 1] = tmp
  //       }
  //     }
  //   }
  //   return arr
  // }
  if (user) {
    let userReg = /^U([0-9]){7}$/
    if (userReg.test(user)) {
      if (type === 'root') {
        User.findOne({id: user})
          .populate({
            path: 'myCreation.root',
            populate: {
              path: 'root'
            },
            options: {
              skip: val * 8,
              limit: 8,
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
                if (user.myCreation && user.myCreation.root) {   // 存在根节点
                  user.myCreation.root.forEach((root) => {
                    rootList.push({
                      root: root.name,
                      count: 1,
                      timeStamp: root.date.getTime(),
                      data: [root.id],
                      cover: tool.formImg(root.coverImg),
                      label: 'root'
                    })
                    console.log('后续结点数量统计' + tool.getRootInfo(root.id, function (count) {
                      console.log(JSON.stringify(count))
                    }))
                  })
                  if (user.myCreation && user.myCreation.story) {
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
                }
                res.send({permit: true, result: rootList})
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
              skip: val * 8,
              limit: 8,
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
                if (user.myCreation && user.myCreation.story) {   // 存在普通故事节点
                  user.myCreation.story.forEach((story) => {
                    storyList.push({
                      root: story.root ? story.root.name : '',
                      rootId: story.root ? story.root.id : '',
                      id: story.id,
                      timeStamp: story.date.getTime(),
                      cover: tool.formImg(story.root.coverImg),
                      label: 'story'
                    })
                  })
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
                  if (user.myCreation && user.myCreation.root) {
                    for (let i = 0; i < user.myCreation.root.length; i++) {
                      for (let j = 0; j < dest.length; j++) {
                        if (user.myCreation.root[i].id === dest[j].rootId) {
                          dest.splice(j, 1)
                        }
                      }
                    }
                  }
                  res.send({permit: true, result: dest})
                }
              }
            }
          })
      }
    } else {
      res.send({permit: false, type: '404'})
    }
  } else {
    console.log('不是user')
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

module.exports = router
