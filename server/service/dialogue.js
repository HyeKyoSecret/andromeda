const express = require('express')
const User = require('../db/User')
const Dialogue = require('../db/Dialogue')
const Message = require('../db/Message')
const mongoose = require('mongoose')
const router = express.Router()
const moment = require('moment')
const tool = require('../tool')
router.get('/dialogue/getDialogue', (req, res) => {
  let id = req.query.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let result = []
  User.findOne({username: user}, (err, doc) => {
    if (err) {
      res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
    } else {
      User.findOne({id: id}, (err2, doc2) => {
        if (err2) {
          res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
        } else {
          if (doc && doc2) {
            Dialogue.findOne({
              $or: [
                { $and: [{people1: doc._id}, {people2: doc2._id}] },
                { $and: [{people2: doc._id}, {people1: doc2._id}] }
              ]
            }).populate({
              path: 'message',
              populate: {
                path: 'to'
              }
            }).populate({
              path: 'message',
              populate: {
                path: 'from'
              }
            }).exec((err3, dialogue) => {
              if (err3) {
                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
              } else {
                if (dialogue && dialogue.message && dialogue.message.length) {
                  for (let i = dialogue.message.length - 1; i >= 0; i--) {
                    result.push({
                      me: dialogue.message[i].from._id.toString() === doc._id.toString(),
                      to: dialogue.message[i].to.nickname,
                      from: dialogue.message[i].from.nickname,
                      date: moment(dialogue.message[i].date).format('lll'),
                      content: dialogue.message[i].content,
                      headImg: tool.formImg(dialogue.message[i].from.headImg),
                      timestamp: dialogue.message[i].date.getTime()
                    })
                  }
                  res.send({error: false, result: result.reverse()})
                } else {
                  res.send({error: false, result: []})
                }
              }
            })
          } else {
            res.send({error: false, type: 'user', message: '用户不存在'})
          }
        }
      })
    }
  })
})
router.post('/dialogue/sendMessage', (req, res) => {
  let id = req.body.id
  let message = req.body.message
  let user
  let dialogueId
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
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
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
      } else {
        if (doc.dialogue.some(function (item) {
          if (item.people1.id === id || item.people2.id === id) {
            dialogueId = item._id
            return true
          } else {
            return false
          }
        })) {
          User.findOne({id: id})
            .exec((err2, doc2) => {
              if (err2) {
                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
              } else {
                if (doc2) {
                  let messageContent = {
                    to: doc2._id,
                    from: doc._id,
                    content: message
                  }
                  let newMessage = new Message(messageContent)
                  newMessage.save((err3, newMs) => {
                    if (err3) {
                      res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                    } else {
                      Dialogue.updateOne({_id: mongoose.Types.ObjectId(dialogueId)}, {$push: {'message': newMs._id}})
                        .exec(err4 => {
                          if (err4) {
                            res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                          } else {
                            res.send({error: false})
                          }
                        })
                    }
                  })
                } else {
                  res.send({error: true, type: 'user', message: '用户不存在'})
                }
              }
            })
        } else {
          User.findOne({id: id})
            .exec((err2, doc2) => {
              if (err2) {
                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
              } else {
                if (doc2) {
                  let messageContent = {
                    to: doc2._id,
                    from: doc._id,
                    content: message
                  }
                  let newMessage = new Message(messageContent)
                  newMessage.save((err3, newMs) => {
                    if (err3) {
                      res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                    } else {
                      let dialogueContent = {
                        people1: doc._id,
                        people2: doc2._id,
                        message: [newMs._id]
                      }
                      let newDialogue = new Dialogue(dialogueContent)
                      newDialogue.save((err4, dia) => {
                        if (err4) {
                          res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                        } else {
                          User.updateOne({username: user}, {$push: {'dialogue': dia._id}})
                            .exec(err5 => {
                              if (err5) {
                                res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                              } else {
                                User.updateOne({id: id}, {$push: {'dialogue': dia._id}})
                                  .exec(err6 => {
                                    if (err5) {
                                      res.send({error: true, type: 'db', message: '发生错误，请稍后再试'})
                                    } else {
                                      res.send({error: false})
                                    }
                                  })
                              }
                            })
                        }
                      })
                    }
                  })
                } else {
                  res.send({error: true, type: 'user', message: '用户不存在'})
                }
              }
            })
        }
      }
    })
})
module.exports = router
