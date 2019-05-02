const express = require('express')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const User = require('../db/User')
const Comment = require('../db/Comment')
const rootReg = /^R([0-9]){7}$/
const storyReg = /^S([0-9]){7}$/
const mongoose = require('mongoose')
const router = express.Router()
const moment = require('moment')
const tool = require('../tool')
router.post('/comment/storyComment', (req, res) => {
  const id = req.body.id
  const content = req.body.content
  const to = req.body.to
  const main = req.body.main
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let exe = function () {
    if (rootReg.test(id)) {
      return Root
    } else if (storyReg.test(id)) {
      return Story
    }
  }
  User.findOne({username: user})
    .exec((err, people) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        let newComment = new Comment({
          people: people._id,
          about: id,
          content: content,
          commentTo: to || null
        })
        newComment.save(function (err2, comment) {
          if (err2) {
            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
          } else {
            exe().findOneAndUpdate({id: id}, {$addToSet: {'comment': comment._id}})
              .populate('author')
              .exec((err3, node) => {
                if (err3) {
                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  User.updateOne({username: user}, {$addToSet: {'commentTo': comment._id}})
                    .exec(err4 => {
                      if (err4) {
                        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                      } else {
                        if (main) {
                          Comment.updateOne({_id: mongoose.Types.ObjectId(main)}, {$addToSet: {subComment: comment._id}})
                            .exec(err5 => {
                              if (err5) {
                                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                              } else {
                                res.send({error: false, message: '评论成功'})
                              }
                            })
                        } else {
                          res.send({error: false, message: '评论成功'})
                        }
                      }
                    })
                }
              })
          }
        })
      }
    })
})
router.get('/comment/getComment', (req, res) => {
  const id = req.query.id
  let result = []
  let author = false
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let exe = function () {
    if (rootReg.test(id)) {
      return Root
    } else if (storyReg.test(id)) {
      return Story
    }
  }
  exe().findOne({id: id})
    .populate({
      path: 'comment',
      populate: {
        path: 'people'
      }
    })
    .populate('author')
    .populate({
      path: 'comment',
      populate: {
        path: 'zan'
      }
    })
    .populate({
      path: 'comment',
      populate: {
        path: 'commentTo',
        populate: {
          path: 'people'
        }
      }
    })
    .populate({
      path: 'comment',
      populate: {
        path: 'subComment',
        populate: {
          path: 'people'
        }
      }
    })
    .populate({
      path: 'comment',
      populate: {
        path: 'subComment',
        populate: {
          path: 'commentTo',
          populate: {
            path: 'people'
          }
        }
      }
    })
    .populate({
      path: 'comment',
      populate: {
        path: 'subComment',
        populate: {
          path: 'zan'
        }
      }
    })
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        doc.comment.forEach((comment) => {
          let subContent = []
          if (comment.display) {
            let hasZan = false
            for (let i = 0; i < comment.zan.length; i++) {   // 检查是否赞过
              if (comment.zan[i].username === user) {
                hasZan = true
              }
            }
            if (comment.subComment && comment.subComment.length > 0) {
              for (let i = 0; i < comment.subComment.length; i++) {
                subContent.push({
                  id: comment.subComment[i]._id,
                  people: comment.subComment[i].people.nickname,
                  content: comment.subComment[i].content,
                  zan: comment.subComment[i].zan ? comment.subComment[i].zan.length : 0,
                  commentTo: comment.subComment[i].commentTo ? comment.subComment[i].commentTo.people.nickname : '',
                  date: moment(comment.subComment[i].date).fromNow(),
                  hasZan: comment.subComment[i].zan.some(function (item) {
                    return item.username === user
                  }),
                  isYours: comment.subComment[i].people.username === user
                })
              }
            }
            if (comment && !comment.commentTo) {
              result.push({
                id: comment._id,
                headImg: comment.people ? comment.people.headImg ? tool.formImg(comment.people.headImg) : 'default' : 'default',
                people: comment.people.nickname,
                content: comment.content,
                zan: comment.zan ? comment.zan.length : 0,
                commentTo: comment.commentTo ? comment.commentTo.people.nickname : null,
                date: moment(comment.date).fromNow(),
                hasZan: hasZan,
                subComment: subContent.reverse(),
                showSubComment: false,
                isYours: comment.people.username === user
              })
            }
          }
        })
        if (doc) {
          author = doc.author.username === user
        }
        res.send({error: false, result: result, author: author})
      }
    })
})
router.post('/comment/addZan', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    let id = mongoose.Types.ObjectId(req.body.id)
    User.findOne({username: user}, (err, people) => {
      if (err) {
        res.send({error: true, message: '发生错误', type: 'DB'})
      } else {
        Comment.findOne({_id: id})
          .exec((err, doc) => {
            if (err) {
              res.send({error: true, message: '发生错误', type: 'DB'})
            } else {
              if (doc) {
                if (doc.zan.some(function (id) {
                  return id.toString() === people._id.toString()  // 过滤掉自己的
                })) {
                  res.send({error: false})
                } else {
                  doc.zan.push(people._id)
                  doc.save(err2 => {
                    if (err2) {
                      res.send({error: true, message: '发生错误', type: 'DB'})
                    } else {
                      res.send({error: false, result: 'success'})
                    }
                  })
                }
              } else {
                res.send({error: true, message: '发生错误', type: 'value'})
              }
            }
          })
      }
    })
  } else {
    res.send({error: true, askLogin: true})
  }
})
router.post('/comment/cancelZan', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (user) {
    let id = mongoose.Types.ObjectId(req.body.id)
    User.findOne({username: user}, (err, people) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        Comment.updateOne({_id: id}, {$pull: {'zan': people._id}})
          .exec((err2) => {
            if (err2) {
              res.send({error: true, type: 'DB', message: '发生错误'})
            } else {
              res.send({error: false, result: 'success'})
            }
          })
      }
    })
  }
})
module.exports = router
