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
                  if (main) {
                    // 评论有主评论(一定有to)
                    Comment.updateOne({_id: mongoose.Types.ObjectId(main)}, {$addToSet: {subComment: comment._id}})
                      .exec((err5) => {
                        if (err5) {
                          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                        } else {
                          // 自己的评论不通知
                          Comment.findOne({_id: mongoose.Types.ObjectId(to)})
                            .exec((err7, cm) => {
                              if (err7) {
                                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                              } else {
                                if (cm.people.toString() === people._id.toString()) {
                                  res.send({error: false, message: '评论成功'})
                                } else {
                                  User.updateOne({_id: mongoose.Types.ObjectId(cm.people)}, {$addToSet: {commentFrom: { comment: comment._id }}})
                                    .exec(err6 => {
                                      if (err6) {
                                        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                      } else {
                                        res.send({error: false, message: '评论成功'})
                                      }
                                    })
                                }
                              }
                            })
                        }
                      })
                  } else {
                    // 评论非主评论
                    if (people.nickname === node.author.nickname) {
                      res.send({error: false, message: '评论成功'})
                    } else {
                      User.updateOne({username: node.author.username}, {$addToSet: {commentFrom: { comment: comment._id }}})
                        .exec(err6 => {
                          if (err6) {
                            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                          } else {
                            res.send({error: false, message: '评论成功'})
                          }
                        })
                    }
                  }
                }
              })
          }
        })
      }
    })
})
router.post('/comment/addComment', (req, res) => {
  let commentId = req.body.id
  let content = req.body.content
  let to = req.body.to
  let main = req.body.main
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (commentId.length === 24) {
    User.findOne({username: user})
      .exec((err, people) => {
        if (err) {
          res.send({error: true, message: '发生错误', type: 'db'})
        } else {
          Comment.findOne({_id: mongoose.Types.ObjectId(commentId)})
            .populate('people')
            .exec((err2, mainComment) => {
              if (err2) {
                res.send({error: true, message: '发生错误', type: 'db'})
              } else {
                let newComment = new Comment({
                  people: people._id,
                  about: mainComment.about,
                  content: content,
                  commentTo: to || null
                })
                newComment.save(function (err2, comment) {
                  if (err2) {
                    res.send({error: true, message: '发生错误', type: 'db'})
                  } else {
                    if (main) {
                      // 评论有主评论(一定有to)
                      Comment.updateOne({_id: mongoose.Types.ObjectId(main)}, {$addToSet: {subComment: comment._id}})
                        .exec((err5) => {
                          if (err5) {
                            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                          } else {
                            // 自己的评论不通知
                            Comment.findOne({_id: mongoose.Types.ObjectId(to)})
                              .exec((err7, cm) => {
                                if (err7) {
                                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                } else {
                                  if (cm.people.toString() === people._id.toString()) {
                                    res.send({error: false, message: '评论成功'})
                                  } else {
                                    User.updateOne({_id: mongoose.Types.ObjectId(cm.people)}, {$addToSet: {commentFrom: { comment: comment._id }}})
                                      .exec(err6 => {
                                        if (err6) {
                                          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                        } else {
                                          res.send({error: false, message: '评论成功'})
                                        }
                                      })
                                  }
                                }
                              })
                          }
                        })
                    } else {
                      // 不应该出现没有主评论的情况
                      res.send({error: true, message: '发生错误', type: 'value'})
                    }
                  }
                })
              }
            })
        }
      })
  } else {
    res.send({error: true, type: 'id', message: '找不到该评论'})
  }
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
          let subCount = 0
          if (comment.display) {
            let hasZan = false
            for (let i = 0; i < comment.zan.length; i++) {   // 检查是否赞过
              if (comment.zan[i].username === user) {
                hasZan = true
              }
            }
            if (comment.subComment) {
              comment.subComment.forEach(x => {
                if (x.display) {
                  subCount++
                }
              })
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
                subComment: comment.subComment ? subCount : 0,
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
router.post('/comment/deleteComment', (req, res) => {
  let storyId = req.body.storyId
  let id = mongoose.Types.ObjectId(req.body.id)
  const rootReg = /^R([0-9]){7}$/
  const storyReg = /^S([0-9]){7}$/
  let type = req.body.type
  let exe = function () {
    if (rootReg.test(storyId)) {
      return Root
    } else if (storyReg.test(storyId)) {
      return Story
    }
  }
  async function deleteComment (cid) {
    return new Promise((resolve, reject) => {
      Comment.deleteOne({_id: cid})
        .exec(err => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(true)
          }
        })
    })
  }
  async function getSubCommentList () {
    return new Promise((resolve, reject) => {
      exe().updateOne({id: storyId}, {$pull: { comment: id }})
        .exec(err => {
          if (err) {
            reject(err)
          } else {
            Comment.findOne({_id: id}, (err2, comment) => {
              if (err2) {
                reject(err2)
              } else {
                resolve(comment.subComment)
              }
            })
          }
        })
    })
  }
  async function mainDelete () {
    try {
      let clist = await getSubCommentList()
      for (let i = 0; i < clist.length; i++) {
        await deleteComment(clist[i])
      }
      Comment.deleteOne({_id: id})
        .exec(err => {
          if (err) {
            res.send({error: true, type: 'DB', message: '发生错误'})
          } else {
            res.send({error: false, message: '删除成功'})
          }
        })
    } catch (err) {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      }
    }
  }
  if (type === 'main') {
    mainDelete()
  } else if (type === 'sub') {
    Comment.updateOne({_id: id}, {$set: {display: false}})
      .exec(err => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误'})
        } else {
          res.send({error: false, message: '删除成功'})
        }
      })
  }
})
router.get('/comment/getMessageComment', (req, res) => {
  let user
  let result = []
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let getStoryObj = async function (id) {
    return new Promise((resolve, reject) => {
      Story.findOne({id: id})
        .populate('author')
        .exec((err, story) => {
          if (err) {
            reject(err)
          }
          if (story) {
            resolve(story)
          } else {
            Root.findOne({id: id})
              .populate('author')
              .exec((err, root) => {
                if (err) {
                  reject(err)
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
  async function getRootObj (fid) {
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
    .populate({
      path: 'commentFrom.comment',
      populate: {
        path: 'people'
      }
    })
    .populate({
      path: 'commentFrom.comment',
      populate: {
        path: 'commentTo',
        populate: {
          path: 'people'
        }
      }
    })
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        if (doc) {
          let exe = async function () {
            for (let i = 0; i < doc.commentFrom.length; i++) {
              if (doc.commentFrom[i].comment && doc.commentFrom[i].comment.commentTo) {
                let obj = await getRootObj(doc.commentFrom[i].comment.about)
                result.push({
                  type: 'comment',
                  people: doc.commentFrom[i].comment.people.nickname,
                  peopleId: doc.commentFrom[i].comment.people.id,
                  peopleHead: tool.formImg(doc.commentFrom[i].comment.people.headImg),
                  date: moment(doc.commentFrom[i].comment.date).format('YYYY.MM.DD HH:mm'),
                  commentTo: doc.commentFrom[i].comment.commentTo.people.nickname,
                  commentToId: doc.commentFrom[i].comment.commentTo.people.id,
                  commentContent: doc.commentFrom[i].comment.content,
                  commentId: doc.commentFrom[i].comment._id,
                  coverImg: tool.formImg(obj.coverImg),
                  subPeople: doc.commentFrom[i].comment.commentTo.people.nickname,
                  subContent: doc.commentFrom[i].comment.commentTo.content,
                  subId: doc.commentFrom[i].comment.about
                })
              } else if (doc.commentFrom[i].comment) {     // 对于已经删除或者丢失丢评论不再记录
                let obj = await getRootObj(doc.commentFrom[i].comment.about)
                let sub = await getStoryObj(doc.commentFrom[i].comment.about)
                result.push({
                  type: 'story',
                  people: doc.commentFrom[i].comment.people.nickname,
                  peopleId: doc.commentFrom[i].comment.people.id,
                  peopleHead: tool.formImg(doc.commentFrom[i].comment.people.headImg),
                  date: moment(doc.commentFrom[i].comment.date).format('YYYY.MM.DD HH:mm'),
                  commentContent: doc.commentFrom[i].comment.content,
                  commentId: doc.commentFrom[i].comment._id,
                  coverImg: tool.formImg(obj.coverImg),
                  subPeople: sub.author.nickname,
                  subContent: sub.content,
                  subId: doc.commentFrom[i].comment.about
                })
              }
            }
            result.reverse()
            res.send({error: false, result: result})
          }
          exe().catch(err => {
            if (err) {
              console.log(err)
            }
          })
        } else {
          res.send({error: true, type: 'DB', message: '发生错误, 请重新登录'})
        }
      }
    })
})
router.get('/comment/commentDetails', (req, res) => {
  let user
  let id = req.query.id
  let subContent = []
  let result = {}
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  if (id && id.length === 24) {
    id = mongoose.Types.ObjectId(req.query.id)

    Comment.findOne({ _id: id })
      .populate('zan')
      .populate('people')
      .populate({
        path: 'subComment',
        populate: {
          path: 'people'
        }
      })
      .populate({
        path: 'subComment',
        populate: {
          path: 'commentTo',
          populate: {
            path: 'people'
          }
        }
      })
      .exec((err, comment) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
        } else {
          if (comment.display && comment.subComment && comment.subComment.length > 0) {
            for (let i = 0; i < comment.subComment.length; i++) {
              if (comment.subComment[i].display) {
                subContent.push({
                  id: comment.subComment[i]._id,
                  people: comment.subComment[i].people.nickname,
                  peopleId: comment.subComment[i].people.id,
                  headImg: tool.formImg(comment.subComment[i].people.headImg),
                  content: comment.subComment[i].content,
                  zan: comment.subComment[i].zan ? comment.subComment[i].zan.length : 0,
                  commentTo: comment.subComment[i].commentTo ? comment.subComment[i].commentTo.people.nickname : '',
                  date: moment(comment.subComment[i].date).format('YYYY-M-D HH:mm'),
                  timeStamp: comment.subComment[i].date.getTime(),
                  hasZan: comment.subComment[i].zan.some(function (item) {
                    return item.username === user
                  }),
                  isYours: comment.subComment[i].people.username === user
                })
              }
            }
          }
          result = {
            id: comment._id,
            headImg: tool.formImg(comment.people.headImg),
            people: comment.people.nickname,
            peopleId: comment.people.peopleId,
            content: comment.content,
            zan: comment.zan ? comment.zan.length : 0,
            date: moment(comment.date).format('YYYY-M-D HH:mm'),
            hasZan: comment.zan.username === user,
            subComment: subContent,
            isYours: comment.people.username === user
          }
          res.send({error: false, result: result})
        }
      })
  } else {
    res.send({error: true, type: 'id', message: '找不到该评论'})
  }
})
router.post('/comment/getMainId', (req, res) => {
  let story = req.body.story
  let id = req.body.id
  let mainId = ''
  let exe = function () {
    if (rootReg.test(story)) {
      return Root
    } else if (storyReg.test(story)) {
      return Story
    }
  }
  exe().findOne({id: story})
    .populate('comment')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误'})
      } else {
        for (let i = 0; i < doc.comment.length; i++) {
          if (mainId.length === 0) {
            if (doc.comment[i].subComment) {
              for (let j = 0; j < doc.comment[i].subComment.length; j++) {
                if (doc.comment[i].subComment[j].toString() === id.toString()) {
                  mainId = doc.comment[i]._id
                  break
                }
              }
            }
          } else {
            break
          }
        }
        res.send({error: false, mainId: mainId})
      }
    })
})
router.post('/comment/replyComment', (req, res) => {
  let commentId = req.body.commentId
  let toId
  let content = req.body.content
  let user
  let mainId = ''
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let exe = function (story) {
    if (rootReg.test(story)) {
      return Root
    } else if (storyReg.test(story)) {
      return Story
    }
  }
  if (commentId.length === 24) {
    toId = mongoose.Types.ObjectId(commentId)
  }
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      } else {
        if (doc) {
          Comment.findOne({_id: toId})
            .populate('people')
            .exec((err2, cm) => {
              if (err2) {
                res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
              } else {
                if (cm) {
                  exe(cm.about).findOne({id: cm.about})
                    .populate('comment')
                    .exec((err3, story) => {
                      if (err3) {
                        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                      } else {
                        if (story) {
                          for (let i = 0; i < story.comment.length; i++) {
                            if (mainId.length === 0) {
                              if (story.comment[i].subComment) {
                                for (let j = 0; j < story.comment[i].subComment.length; j++) {
                                  if (story.comment[i].subComment[j].toString() === toId.toString()) {
                                    mainId = story.comment[i]._id
                                    break
                                  }
                                }
                              }
                            } else {
                              break
                            }
                          }
                          let newComment = new Comment({
                            people: doc._id,
                            about: cm.about,
                            content: content,
                            commentTo: toId || null
                          })
                          newComment.save((err4, comment) => {
                            if (err4) {
                              res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                            } else {
                              exe(cm.about).updateOne({id: cm.about}, {$addToSet: { comment: comment._id }})
                                .exec(err5 => {
                                  if (err5) {
                                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                  } else {
                                    if (mainId) {
                                      mainId = mongoose.Types.ObjectId(mainId)
                                      Comment.updateOne({_id: mainId}, {$addToSet: {subComment: comment._id}})
                                        .exec(err7 => {
                                          if (err7) {
                                            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                          } else {
                                            if (cm.people.username === user) {
                                              res.send({error: false, message: '评论成功'})
                                            } else {
                                              User.updateOne({username: cm.people.username}, {$addToSet: {commentFrom: { comment: comment._id }}})
                                                .exec(err6 => {
                                                  if (err6) {
                                                    res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                                  } else {
                                                    res.send({error: false, message: '评论成功'})
                                                  }
                                                })
                                            }
                                          }
                                        })
                                    } else {
                                      // 当前toId 就是主评论
                                      cm.subComment.push(comment._id)       // 向主评论添加本评论
                                      if (cm.people.username === user) {
                                        cm.save(err6 => {
                                          if (err6) {
                                            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                          } else {
                                            res.send({error: false, message: '评论成功'})
                                          }
                                        })
                                      } else {
                                        cm.save(err8 => {
                                          if (err8) {
                                            res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                          } else {
                                            User.updateOne({username: cm.people.username}, {$addToSet: {commentFrom: { comment: comment._id }}})
                                              .exec(err9 => {
                                                if (err9) {
                                                  res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                                                } else {
                                                  res.send({error: false, message: '评论成功'})
                                                }
                                              })
                                          }
                                        })
                                      }
                                    }
                                  }
                                })
                            }
                          })
                        }
                      }
                    })
                } else {
                  res.send({error: true, type: 'value', message: '该评论已被删除'})
                }
              }
            })
        }
      }
    })
})
router.post('/comment/changeReadState', (req, res) => {
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  User.findOne({username: user})
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'db', message: '发生错误'})
      } else {
        if (doc.commentFrom) {
          let temp = doc.commentFrom
          temp.forEach(item => {
            item.readed = true
          })
          User.findOneAndUpdate({username: user}, {$set: {'commentFrom': temp}})
            .exec((err2, x) => {
              if (err2) {
                res.send({error: true, type: 'db', message: '发生错误'})
              } else {
                res.send({error: false})
              }
            })
        }
      }
    })
})
module.exports = router
