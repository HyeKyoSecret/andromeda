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
                        if (!to) {
                          User.updateOne({username: node.author.username}, {
                            $addToSet: {'commentFrom': comment._id, 'promote': {'description': 'comment', 'content_1': people.username, 'content_2': '评论了你', 'content_3': comment.content}}
                          }).exec(err5 => {
                            if (err5) {
                              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                            } else {
                              res.send({error: false, message: '评论成功'})
                            }
                          })
                        } else {
                          Comment.findOne({_id: mongoose.Types.ObjectId(to)})
                            .exec((err6, doc) => {
                              if (err6) {
                                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                              } else {
                                User.updateOne({username: doc.people}, {
                                  $addToSet: {'commentFrom': comment._id, 'promote': {'description': 'comment', 'content_1': people.username, 'content_2': '评论了你', 'content_3': comment.content}}
                                }).exec(err7 => {
                                  if (err7) {
                                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                  } else {
                                    res.send({error: false, message: '评论成功'})
                                  }
                                })
                              }
                            })
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
        path: 'commentTo',
        populate: {
          path: 'people'
        }
      }
    })
    .exec((err, doc) => {
      if (err) {
        console.log(err)
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        doc.comment.forEach((comment) => {
          if (comment.display) {
            result.push({
              id: comment._id,
              headImg: tool.formImg(comment.people.headImg),
              people: comment.people.nickname,
              content: comment.content,
              zan: comment.zan ? comment.zan.length : 0,
              commentTo: comment.commentTo ? comment.commentTo.people.nickname : null,
              date: moment(comment.date).fromNow()
            })
          }
        })
        if (doc) {
          author = doc.author.username === user
        }
        res.send({error: false, result: result, author: author})
      }
    })
})
module.exports = router
