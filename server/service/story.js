/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const User = require('../db/User')
const router = express.Router()
const moment = require('moment')
const rootReg = /^R([0-9]){7}$/
const storyReg = /^S([0-9]){7}$/
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const client = require('../client')
const tool = require('../tool')
const gm = require('gm').subClass({imageMagick: true})
const mongoose = require('../db/mongoose')
moment.locale('zh-cn')
router.post('/story/buildRoot', (req, res) => {
  const form = new formidable.IncomingForm()
  const imgPath = path.resolve(__dirname, '../picture/cover/')   // 图片保存路径
  // const targetPath = path.join(__dirname, './../tempPic/')      // 暂存路径/
  const proPath = path.join(__dirname, '../../dist/static/thumb/cover/')    // 生产环境图片路径
  const thumbPath = path.join(__dirname, '../../static/thumb/cover/')
  function copyIt (from, to) {    // 复制文件
    fs.writeFileSync(to, fs.readFileSync(from))
    // fs.createReadStream(src).pipe(fs.createWriteStream(dst))  大文件复制
  }
  if (!fs.existsSync('../picture')) {
    fs.mkdirSync('../picture')
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
  let author = req.session.user || (req.cookies.And && req.cookies.And.user)
  if (author) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.log(err)
      } else {
        let fileName
        if (files.file) {
          fileName = tool.getFileName(files.file.path)
        } else {
          fileName = ''
        }
        let savePath = path.join(imgPath, fileName)
        let usePath = path.join(proPath, fileName)
        let thumbSavePath = path.join(thumbPath, fileName)
        let rootStory = {
          // name: rootName.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),     // 过滤大于小于美元符号
          name: fields.name,
          content: fields.content,
          // content: rootContent.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),
          writePermit: fields.writePermit,
          recommend: fields.recommend,
          coverImg: savePath
        }
        User.findOne({username: author}, (err, user) => {
          'use strict'
          if (err) {
            res.send({permit: false, message: '服务器忙，请稍后再试'})
          } else {
            rootStory.author = user._id
            Root.findOne({name: rootStory.name})
              .exec((err2, oldRoot) => {
                if (err2) {
                  console.log(err2)
                } else {
                  if (oldRoot) {
                    res.send({permit: false, message: '故事名重复'})
                  } else {
                    let newRoot = new Root(rootStory)
                    newRoot.save((err3, root) => {
                      if (err3) {
                        console.log(err3)
                        res.send({permit: false, message: '服务器忙，请稍后再试'})
                      } else {
                        user.update({$push: {'myCreation.root': root._id}})
                          .exec(err => {
                            if (err) {
                              res.send({permit: false, message: '服务器忙，请稍后再试'})
                            }
                            user.update({$set: {'myCreationDraft.root.name': '', 'myCreationDraft.root.content': '', 'myCreationDraft.root.writePermit': true}})
                              .exec(saveError => {
                                if (saveError) {
                                  res.send({permit: false, message: '发生错误，请稍后再试'})
                                } else {
                                  if (rootStory.recommend) {
                                    for (let i = 0; i < rootStory.recommend.length; i++) {
                                      User.update({id: rootStory.recommend[i].id}, {$push:
                                          {'promote': {'description': 'recommend', 'content_1': author, 'content_2': '向您推荐了', 'content_3': root.name, 'content_4': root.id}}
                                      }).exec((err) => {
                                        if (err) {
                                          res.send({permit: false, message: '服务器忙，请稍后再试'})
                                        }
                                        if (i === rootStory.recommend.length - 1) {
                                          gm(savePath)
                                            .thumb(300, 400, thumbSavePath, 80, function (err) {
                                              if (err) {
                                                res.send({permit: false, type: 'gm', message: '发生错误'})
                                              } else {
                                                copyIt(thumbSavePath, usePath)     // 拷贝文件
                                                res.send({permit: true, message: '发布成功'})                                              }
                                            })
                                        }
                                      })
                                    }
                                  } else {
                                    gm(savePath)
                                      .thumb(300, 400, thumbSavePath, 80, function (err) {
                                        if (err) {
                                          res.send({permit: false, type: 'gm', message: '发生错误'})
                                        } else {
                                          copyIt(thumbSavePath, usePath)     // 拷贝文件
                                          res.send({permit: true, message: '发布成功'})                                              }
                                      })
                                  }
                                }
                              })
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
  } else {
    res.send({permit: false, message: '没有权限操作，请先登录'})
  }
})
router.get('/story/getStory', (req, res) => {
  'use strict'
  let id = req.query.id
  let result = {
    title: '',
    content: '',
    author: '',
    date: ''
  }
  let user = req.session.userId ? req.session.userId : req.cookies.And ? req.cookies.And.userId : null
  if (rootReg.test(id)) {
    Root.findOne({id: id})
      .populate('author')
      .exec((err, root) => {
        if (err) {
          res.send({permit: false})
        } else {
          if (root) {
            result.title = root.name
            result.content = root.content
            result.author = root.author.nickname
            result.authorId = root.author.id
            result.date = moment(root.date).format('YYYY年M月D日 HH:mm')
            User.findOne({id: user})
              .exec((err, doc) => {
                if (err) {
                  res.send({permit: false, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  if (doc) {
                    Root.updateOne({id: id}, {$addToSet: {'readCounts': doc._id}})
                      .exec(err => {
                        if (!err) {
                          result.hasFocus = doc.focus.some(function (item) {
                            return item.toString() === root.author._id.toString()
                          })
                          result.showFocus = root.author.id !== user
                          res.send({permit: true, result: result})
                        }
                      })
                  } else {
                    res.send({permit: true, result: result})
                  }
                }
              })
          } else {
            res.send({permit: false})
          }
        }
      })
  } else if (storyReg.test(id)) {
    Story.findOne({ id: id })
      .populate('root')
      .populate('author')
      .populate({
        path: 'root',
        populate: {
          path: 'author'
        }
      })
      .exec((err, story) => {
        if (err) {
          res.send({permit: false})
        } else {
          if (story) {
            result.title = story.root.name
            result.content = story.content
            result.author = story.author.nickname
            result.authorId = story.author.id
            result.date = moment(story.date).format('YYYY年M月D日 HH:mm')
            User.findOne({id: user})
              .exec((err, doc) => {
                if (err) {
                  res.send({permit: false, type: 'DB', message: '发生错误，请稍后再试'})
                } else {
                  if (doc) {
                    Story.updateOne({id: id}, {$addToSet: {'readCounts': doc._id}})
                      .exec(err => {
                        if (!err) {
                          result.hasFocus = doc.focus.some(function (item) {
                            return item.toString() === story.root.author._id.toString()
                          })
                          result.showFocus = story.author.id !== user
                          res.send({permit: true, result: result})
                        }
                      })
                  } else {
                    res.send({permit: true, result: result})
                  }
                }
              })
          } else {
            res.send({permit: false})
          }
        }
      })
  } else {
    res.send({permit: false})
  }
})
router.get('/story/getMenuData', (req, res) => {
  'use strict'
  let id = req.query.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  let result = {
    num: null,
    zan: null
  }
  let uid = function (user) {
    return new Promise(function (resolve, reject) {
      User.findOne({username: user}, (err, user) => {
        if (err) {
          console.log(err)
        }
        if (user) {
          resolve(user._id)
        } else {
          resolve('customer')
        }
      })
    })
  }
  let getZan = async function (user) {
    let userId = await uid(user)
    if (rootReg.test(id)) {
      Root.findOne({id: id})
        .exec((err2, root) => {
          if (err2) {
            res.send({error: true})
          }
          if (root) {
            if (root.zan) {
              result.zan = root.zan.some(function (ele) {
                return ele.toString() === userId.toString()
              })
              result.num = root.zan.length
              res.send({error: false, result: result})
            } else {
              result.zan = false
              result.num = 0
              res.send({error: false, result: result})
            }
          } else {
            res.send({error: true})
          }
        })
    } else if (storyReg.test(id)) {
      Story.findOne({id: id})
        .exec((err2, story) => {
          if (err2) {
            res.send({error: true})
          }
          if (story.zan) {
            result.zan = story.zan.some(function (ele) {
              return ele.toString() === userId.toString()
            })
            result.num = story.zan.length
            res.send({error: false, result: result})
          } else {
            result.zan = false
            result.num = 0
            res.send({error: false, result: result})
          }
        })
    } else {
      res.send({error: true})
    }
  }
  getZan(user)
})
router.post('/story/saveRootDraft', (req, res) => {
  'use strict'
  let rootName = req.body.rootName
  let rootContent = req.body.rootContent
  let writePermit = req.body.writePermit
  let author
  if (req.session.user) {
    author = req.session.user
  } else if (req.cookies.And) {
    author = req.cookies.And.user
  }
  if (author) {
    User.findOne({username: author}, (err, user) => {
      if (err) {
        res.send({permit: false, message: '发生错误，请稍后再试'})
      } else {
        user.update({$set: {'myCreationDraft.root.name': rootName, 'myCreationDraft.root.content': rootContent, 'myCreationDraft.root.writePermit': writePermit}})
          .exec(error => {
            if (error) {
              res.send({permit: false, message: '发生错误，请稍后再试'})
            } else {
              res.send({permit: true})
            }
          })
      }
    })
  } else {
    res.send({permit: false, message: '没有权限操作'})
  }
})
router.post('/story/saveStoryDraft', (req, res) => {
  'use strict'
  let author
  if (req.session.user) {
    author = req.session.user
  } else if (req.cookies.And) {
    author = req.cookies.And.user
  }
  if (author) {
    User.findOne({username: author}, (err, user) => {
      if (err) {
        console.log(err)
      }
      if (user) {
        if (user.myCreationDraft.story.length === 0) {
          user.myCreationDraft.story.push({
            id: req.body.id,
            content: req.body.storyContent
          })
        } else {
          for (let i = 0; i < user.myCreationDraft.story.length; i++) {
            if (user.myCreationDraft.story[i].id === req.body.id) {
              user.myCreationDraft.story[i].content = req.body.storyContent
            } else {
              if (i === user.myCreationDraft.story.length - 1) {
                user.update({$push: {'myCreationDraft.story': {'id': req.body.id, 'content': req.body.storyContent}}})
                  .exec(error => {
                    if (error) {
                      // 拒绝
                      res.send({permit: false, message: '发生错误请稍后再试'})
                    }
                    res.send({permit: true})
                  })
              }
            }
          }
        }
      } else {
        // 拒绝
        res.send({permit: false, message: '发生错误请稍后再试'})
      }
    })
  } else {
    res.send({permit: false, message: '没有权限操作'})
  }
})
router.get('/story/getRootDraft', (req, res) => {
  'use strict'
  let author
  if (req.session.user) {
    author = req.session.user
  } else if (req.cookies.And) {
    author = req.cookies.And.user
  } else {
    return
  }
  User.findOne({username: author}, (err, user) => {
    if (err) {
      res.send({draft: false})
    } else {
      if (user.myCreationDraft.root.name || user.myCreationDraft.root.content) {
        res.send({
          draft: true,
          name: user.myCreationDraft.root.name,
          content: user.myCreationDraft.root.content,
          writePermit: user.myCreationDraft.root.writePermit
        })
      } else {
        res.send({draft: false})
      }
    }
  })
})
router.get('/story/getStoryDraft', (req, res) => {
  'use strict'
  let author
  let result = ''
  if (req.session.user) {
    author = req.session.user
  } else if (req.cookies.And) {
    author = req.cookies.And.user
  } else {
    return
  }
  let id = req.query.id
  if (storyReg.test(id)) {
    User.findOne({username: author}, (err, user) => {
      if (err) {
        res.send(null)
      }
      if (user.myCreationDraft.story.length) {
        for (let i = 0; i < user.myCreationDraft.story.length; i++) {
          if (user.myCreationDraft.story[i].id === id) {
            result = user.myCreationDraft.story[i].content
          }
        }
        res.send(result)
      } else {
        res.send(result)
      }
    })
  } else {   // id 不合法
    res.send(result)
  }
})
router.get('/story/getRootStory', (req, res) => {
  Root.find({}, (err, doc) => {
    if (err) {
      console.log(err)
    } else {
      res.send(doc)
    }
  })
})
// router.post('/story/xuildStory', (req, res) => {
//   let ftNode = req.body.ftNode
//   let nodeName = req.body.nodeName
//   let node = {
//     name: nodeName
//   }
//   let newStory = new Story(node)
//   newStory.save((err, doc) => {
//     if (err) {
//       console.log(err)
//     } else {
//       Root.findOne({name: ftNode}) // 判断前趋结点是否为根节点
//         .exec((errRoot, root) => {
//           if (errRoot) {
//             console.log(errRoot)
//             res.send('error')
//           } else {
//             if (root) {    // 前驱结点是根节点
//               console.log('前驱结点是根节点')
//               if (root.lc) {   // 根节点lc非空
//                 console.log('根节点的 lc 非空')
//                 console.log('根节点 lc 指向' + root.lc)
//                 console.log('开始查找根节点的lc指向的故事')
//                 Story.findOne({_id: root.lc})
//                   .exec((err, story) => {
//                     if (err) {
//                       console.log(err)
//                       res.send('error')
//                     } else {
//                       if (story) {
//                         console.log('找到根节点的lc所指向的故事')
//                         let p = story.rb
//                         console.log('p结点赋值，story.rb' + p)
//
//                         let changeP = function () {
//                           return new Promise(function (resolve, reject) {
//                             Story.findOne({_id: p}, (error, nStory) => {
//                               if (error) {
//                                 console.log(error)
//                               } else {
//                                 p = nStory.rb
//                                 if (!p) {
//                                   console.log('p已置空')
//                                   nStory.rb = doc._id
//                                   console.log('p的新值' + doc._id)
//                                   nStory.save((err3) => {
//                                     if (err3) {
//                                       console.log(err3)
//                                     } else {
//                                       console.log('写入成功')
//                                       res.send('ok')
//                                     }
//                                   })
//                                 }
//                                 resolve(p)
//                                 reject('error+++++!!')
//                               }
//                             })
//                           })
//                         }
//
//                         let search = async function () {
//                           while (p) {
//                             p = await changeP()
//                             console.log('循环中的p' + p)
//                           }
//                           if (!p) {
//                             console.log('检测到p为空，即表明该节点的右指针为空')
//                             story.rb = doc._id
//                             console.log('story.rb' + story.rb)
//                             story.save((err4) => {
//                               if (err4) {
//                                 console.log(err4 + '保存失败')
//                                 res.send('error')
//                               }
//                             })
//                             res.send('ok')
//                           }
//                         }
//
//                         search().catch((err) => {
//                           'use strict'
//                           console.log('执行出现了错误' + err)
//                           res.send('error')
//                         })
//                       } else {
//                         console.log('根节点的lc故事出错')
//                         res.send('error')
//                       }
//                     }
//                   })
//               } else {
//                 console.log('根节点的lc为空')
//                 root.lc = doc._id
//                 root.save((err) => {
//                   console.log(err)
//                   res.send('ok')
//                 })
//               }
//             } else {      // 前趋结点不是根节点
//               console.log('前驱结点不是根节点')
//               Story.findOne({name: ftNode})
//                 .exec((err, odstory) => {
//                   'use strict'
//                   if (err) {
//                     console.log(err)
//                     res.send('error')
//                   } else {
//                     if (odstory) {    // 前驱结点是普通故事结点
//                       console.log('前驱结点是普通故事结点')
//                       if (odstory.lc) {   // 普通故事结点lc非空
//                         console.log('普通故事结点lc非空')
//                         console.log('普通故事结点 lc 指向' + odstory.lc)
//                         console.log('开始查找普通故事结点的lc指向的故事')
//                         Story.findOne({_id: odstory.lc})
//                           .exec((err, story) => {
//                             if (err) {
//                               console.log(err)
//                               res.send('error')
//                             } else {
//                               if (story) {
//                                 console.log('找到故事结点的lc所指向的故事')
//                                 let p = story.rb
//                                 console.log('p结点赋值，story.rb' + p)
//                                 let changeP = function () {
//                                   return new Promise(function (resolve, reject) {
//                                     Story.findOne({_id: p}, (error, nStory) => {
//                                       if (error) {
//                                         console.log(error)
//                                       } else {
//                                         p = nStory.rb
//                                         if (!p) {
//                                           console.log('p已置空')
//                                           nStory.rb = doc._id
//                                           console.log('p的新值' + doc._id)
//                                           nStory.save((err3) => {
//                                             if (err3) {
//                                               console.log(err3)
//                                             } else {
//                                               console.log('写入成功')
//                                             }
//                                           })
//                                         }
//                                         resolve(p)
//                                         reject('error+++++!!')
//                                       }
//                                     })
//                                   })
//                                 }
//
//                                 let search = async function () {
//                                   while (p) {
//                                     p = await changeP()
//                                     console.log('循环中的p' + p)
//                                   }
//                                   if (!p) {
//                                     console.log('检测到p为空，即表明该节点的右指针为空')
//                                     story.rb = doc._id
//                                     console.log('story.rb' + story.rb)
//                                     story.save((err4) => {
//                                       if (err4) {
//                                         console.log(err4 + '保存失败')
//                                         res.send('error')
//                                       }
//                                     })
//                                     console.log(story + '12345689')
//                                     res.send('ok')
//                                   }
//                                 }
//
//                                 search().catch((err) => {
//                                   console.log('执行出现了错误' + err)
//                                   res.send('error')
//                                 })
//                               } else {
//                                 console.log('普通故事结点的lc故事出错')
//                                 res.send('error')
//                               }
//                             }
//                           })
//                       } else {
//                         console.log('普通故事结点的lc为空')
//                         odstory.lc = doc._id
//                         odstory.save((err) => {
//                           if (err) {
//                             console.log(err)
//                             res.send('error')
//                           } else {
//                             res.send('ok')
//                           }
//                         })
//                       }
//                     }
//                   }
//                 })
//             }
//           }
//         })
//     }
//   })
// })
router.post('/story/buildStory', (req, res) => {
  'use strict'
  let ftNode = req.body.ftNode
  let content = req.body.content
  let author
  if (req.session.user) {
    author = req.session.user
  } else if (req.cookies.And) {
    author = req.cookies.And.user
  } else {
    res.send({error: true, type: 'login', message: '发布失败，请先登录'})
  }
  let story = {
    content: content
  }
  User.findOne({username: author})
    .exec((err, user) => {
      if (err) {
        res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
      }
      if (user) {
        story.author = user._id
        let newStory = new Story(story)
        newStory.save((saveErr, doc) => {
          if (saveErr) {
            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
          }
          if (ftNode.split('')[0] === 'R') { // 从ftNode id上判断前驱节点是否是根节点
            Root.findOne({id: ftNode})
              .exec((rootErr, root) => {
                if (rootErr) {
                  res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                }
                if (root) {   // 查询到ftNode是根节点
                  if (root.lc) {    // root.lc 非空
                    Story.findOne({_id: root.lc})
                      .exec((storyErr, story) => {
                        if (storyErr) {
                          res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                        } else {
                          if (story) {
                            let p = story.rb     // 创建指针p 指向当前故事的rb
                            let changeP = function () {
                              return new Promise(function (resolve, reject) {
                                Story.findOne({_id: p}, (error, nStory) => {
                                  if (error) {
                                    res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                  } else {
                                    p = nStory.rb
                                    if (!p) {
                                      nStory.update({$set: {rb: doc._id}})
                                        .exec((err3) => {
                                          if (err3) {
                                            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                          }
                                          doc.update({$set: {root: nStory.root}}, (err6) => {
                                            if (err6) {
                                              res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                            }
                                            User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                                              .exec((err7) => {
                                                if (err7) {
                                                  res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                                }
                                                res.send({success: true, message: '发布成功'})
                                              })
                                          })
                                        })
                                    }
                                    resolve(p)
                                  }
                                })
                              })
                            }

                            let search = async function () {
                              if (!p) { // root的第一个子节点的rb为空
                                story.update({$set: {rb: doc._id}})
                                  .exec((err4) => {
                                    if (err4) {
                                      res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                    }
                                    doc.update({$set: {root: story.root}}, (err6) => {
                                      if (err6) {
                                        res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                      }
                                      User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                                        .exec((err7) => {
                                          if (err7) {
                                            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                          }
                                          res.send({success: true, message: '发布成功'})
                                        })
                                    })
                                  })
                              }
                              while (p) {
                                p = await changeP()
                              }
                            }

                            search().catch((err) => {
                              if (err) {
                                res.send({error: true, type: 'story', message: '服务器忙，请稍后再试'})
                              }
                            })
                          } else {
                            res.send({error: true, type: 'story', message: '查询出错，故事已不存在'})
                          }
                        }
                      })
                  } else { // root.lc 不存在
                    root.update({$set: {lc: doc._id}})
                      .exec(err => {
                        if (err) {
                          res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                        }
                        doc.update({$set: {root: root._id}}, (docErr) => {
                          if (docErr) {
                            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                          }
                          User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                            .exec((err7) => {
                              if (err7) {
                                res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                              }
                              res.send({success: true, message: '发布成功'})
                            })
                        })
                      })
                  }
                } else {
                  res.send({error: true, type: 'root', message: '查询出错，故事已不存在'})
                }
              })
          } else if (ftNode.split('')[0] === 'S') { // 从ftNode id上判断前驱节点是否是普通故事节点
            Story.findOne({id: ftNode})
              .exec((err, odstory) => {
                if (err) {
                  res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                } else {
                  if (odstory) {    // 前驱结点是普通故事结点
                    if (odstory.lc) {   // 普通故事结点lc非空
                      Story.findOne({_id: odstory.lc})
                        .exec((err, story) => {
                          if (err) {
                            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                          } else {
                            if (story) {
                              let p = story.rb
                              let changeP = function () {
                                return new Promise(function (resolve, reject) {
                                  Story.findOne({_id: p}, (error, nStory) => {
                                    if (error) {
                                      res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                    } else {
                                      p = nStory.rb
                                      if (!p) {
                                        nStory.update({$set: {rb: doc._id}})
                                          .exec((err3) => {
                                            if (err3) {
                                              res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                            }
                                            doc.update({$set: {root: nStory.root}}, (err6) => {
                                              if (err6) {
                                                res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                              }
                                              User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                                                .exec((err7) => {
                                                  if (err7) {
                                                    res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                                  }
                                                  res.send({success: true, message: '发布成功'})
                                                })
                                            })
                                          })
                                      }
                                      resolve(p)
                                    }
                                  })
                                })
                              }

                              let search = async function () {
                                if (!p) {
                                  story.update({$set: {rb: doc._id}})
                                    .exec((err4) => {
                                      if (err4) {
                                        res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                      }
                                      doc.update({$set: {root: story.root}}, (err6) => {
                                        if (err6) {
                                          res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                        }
                                        User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                                          .exec((err7) => {
                                            if (err7) {
                                              res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                            }
                                            res.send({success: true, message: '发布成功'})
                                          })
                                      })
                                    })
                                }
                                while (p) {
                                  p = await changeP()
                                }
                              }

                              search().catch((err) => {
                                if (err) {
                                  res.send({error: true, type: 'story', message: '服务器忙，请稍后再试'})
                                }
                              })
                            } else {
                              res.send({error: true, type: 'root', message: '查询出错，故事已不存在'})
                            }
                          }
                        })
                    } else {    // 普通故事结点.lc为空
                      odstory.update({$set: {lc: doc._id}})
                        .exec(err => {
                          if (err) {
                            res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                          }
                          doc.update({$set: {root: odstory.root}}, (docErr) => {
                            if (docErr) {
                              res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                            }
                            User.findOneAndUpdate({username: author}, {$push: {'myCreation.story': doc._id}})
                              .exec((err7) => {
                                if (err7) {
                                  res.send({error: true, type: 'database', message: '服务器忙，请稍后再试'})
                                }
                                res.send({success: true, message: '发布成功'})
                              })
                          })
                        })
                    }
                  }
                }
              })
          }
        })
      } else {
        res.send({error: true, type: 'login', message: '发布失败，请先登录'})
      }
    })
})
router.get('/checkRootName', (req, res) => {
  'use strict'
  let name = req.query.name  // 过滤还没检查
  Root.findOne({name: name}, (err, root) => {
    if (err) {
      console.log(err)
      res.send(err.message)
    } else {
      if (root) {
        res.send('exist')
      } else {
        res.send('ok')
      }
    }
  })
})
router.post('/story/getMyCreationPreview', (req, res) => {
  'use strict'
  let data = req.body.data
  let result = {
    root: {
      id: '',
      name: '',
      date: null,
      content: '',
      writePermit: null
    },
    story: []
  }
  if (data.label) {
    if (data.data.length === 1) {
      Root.findOne({id: data.data[0]})
        .exec((err, root) => {
          if (err) {
            console.log(err)
          }
          if (root) {
            result.root.id = root.id
            result.root.name = root.name
            result.root.date = moment(root.date).format('LL')
            result.root.content = root.content
            result.root.writePermit = root.writePermit
            res.send(result)
          }
        })
    } else if (data.data.length > 1) {
      Root.findOne({id: data.data[0]})
        .exec((err, root) => {
          if (err) {
            console.log(err)
          }
          if (root) {
            result.root.id = root.id
            result.root.name = root.name
            result.root.date = moment(root.date).format('LL')
            result.root.content = root.content
            result.root.writePermit = root.writePermit
            data.data.splice(0, 1)
            Story.find({id: {$in: data.data}}, (err, story) => {
              if (err) {
                console.log(err)
              }
              if (story) {
                for (let i = 0; i < story.length; i++) {
                  result.story.push({
                    id: story[i].id,
                    content: story[i].content,
                    date: moment(story[i].date).format('LL')
                  })
                }
                res.send(result)
              }
            })
          }
        })
    }
  } else {
    Story.find({id: {$in: data.data}}, (err, story) => {
      if (err) {
        console.log(err)
      }
      if (story) {
        for (let i = 0; i < story.length; i++) {
          result.story.push({
            id: story[i].id,
            content: story[i].content,
            date: story[i].date
          })
        }
        res.send(result)
      }
    })
  }
})
router.post('/story/changeWritePermit', (req, res) => {
  'use strict'
  let writePermit = req.body.writePermit
  if (typeof writePermit === 'boolean') {
    Root.updateOne({name: req.body.rootName}, {$set: {'writePermit': writePermit}})
      .exec((err) => {
        if (err) {
          res.send('error')
        } else {
          res.send('ok')
        }
      })
  }
})
router.post('/story/addZan', (req, res) => {
  'use strict'
  let id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({login: false})
    return
  }
  User.findOne({username: user})
    .exec((err, user) => {
      if (err) {
        res.send({login: true, success: false})
      }
      if (user) {
        if (rootReg.test(id)) {
          Root.findOneAndUpdate({id: id}, {$push: {'zan': user._id}})
            .exec((err2, root) => {
              if (err2) {
                res.send({login: true, success: false})
              }
              user.update({$push: {'zan.root': root._id}}, {upsert: true})
                .exec(err3 => {
                  if (err3) {
                    res.send({login: true, success: false})
                  } else {
                    res.send({login: true, success: true})
                  }
                })
            })
        } else if (storyReg.test(id)) {
          Story.findOneAndUpdate({id: id}, {$push: {'zan': user._id}})
            .exec((err2, story) => {
              if (err2) {
                res.send({login: true, success: false})
              }
              user.update({$push: {'zan.story': story._id}}, {upsert: true})
                .exec(err3 => {
                  if (err3) {
                    res.send({login: true, success: false})
                  } else {
                    res.send({login: true, success: true})
                  }
                })
            })
        } else {
          res.send({login: true, success: false})
        }
      } else {
        res.send({login: false, success: false})
      }
    })
})
router.post('/story/cancelZan', (req, res) => {
  'use strict'
  let id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({login: false})
    return
  }
  User.findOne({username: user}, (err, userId) => {
    if (err) {
      res.send({login: false, success: false})
    }
    if (user) {
      if (rootReg.test(id)) {
        Root.findOneAndUpdate({id: id}, {$pull: {'zan': userId._id}}, (err2, root) => {
          if (err2) {
            res.send({login: false, success: false})
          }
          User.updateOne({username: user}, {$pull: {'zan.root': root._id}})
            .exec(err3 => {
              if (!err3) {
                res.send({login: true, success: true})
              } else {
                res.send({error: true, message: '发生错误', type: 'DB'})
              }
            })
        })
      } else if (storyReg.test(id)) {
        Story.findOneAndUpdate({id: id}, {$pull: {'zan': userId._id}}, (err2, story) => {
          if (err2) {
            res.send({login: false, success: false})
          }
          User.updateOne({username: user}, {$pull: {'zan.root': story._id}})
            .exec(err3 => {
              if (!err3) {
                res.send({login: true, success: true})
              } else {
                res.send({error: true, message: '发生错误', type: 'DB'})
              }
            })
        })
      } else {
        res.send({login: true, success: false})
      }
    } else {
      res.send({login: false, success: false})
    }
  })
})
router.get('/story/getSubscribe', (req, res) => {
  'use strict'
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({login: false})
    return
  }
  let rootId = function (id) {
    let rId = id
    return new Promise((resolve, reject) => {
      if (rootReg.test(rId)) {
        Root.findOne({id: id})
          .exec((err, root) => {
            if (err) {
              reject()
            }
            if (root) {
              resolve(root._id)
            } else {
              reject()
            }
          })
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .populate('root')
          .exec((err, story) => {
            if (err) {
              reject()
            }
            if (story && story.root) {
              resolve(story.root._id)
            } else {
              reject()
            }
          })
      } else {
        reject()
      }
    })
  }
  let exe = async function () {
    try {
      let id = await rootId(req.query.id)
      User.findOne({username: user})
        .exec((err, user) => {
          if (err) {
            res.send({login: true, success: false})
          }
          if (user) {
            let result = user.subscribe.some((item) => {
              return item.toString() === id.toString()
            })
            res.send({login: true, success: true, result: result})
          } else {
            res.send({login: true, success: false})
          }
        })
    } catch (e) {
      res.send({login: true, success: false})
    }
  }
  exe()
})
router.post('/story/addSubscribe', (req, res) => {
  'use strict'
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({login: false})
    return
  }
  let rootId = function (id) {
    let rId = id
    return new Promise((resolve, reject) => {
      if (rootReg.test(rId)) {
        resolve(rId)
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .populate('root')
          .exec((err, story) => {
            if (err) {
              reject()
            }
            if (story.root) {
              resolve(story.root.id)
            } else {
              reject()
            }
          })
      } else {
        reject()
      }
    })
  }
  let exe = async function () {
    try {
      let id = await rootId(req.body.id)
      User.findOne({username: user}, (err, user) => {
        if (err) {
          res.send({login: true, success: false})
        }
        if (user) {
          Root.findOneAndUpdate({id: id}, {$addToSet: {'subscribe': user._id}}, (err2, root) => {
            if (err2) {
              res.send({login: true, success: false})
            }
            user.update({$addToSet: {'subscribe': root._id}})
              .exec((err3) => {
                if (err3) {
                  res.send({login: true, success: false})
                }
                res.send({login: true, success: true})
              })
          })
        } else {
          res.send({login: false, success: false})
        }
      })
    } catch (e) {
      res.send({login: false, success: false})
    }
  }
  exe()
})
router.post('/story/cancelSubscribe', (req, res) => {
  'use strict'
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  } else {
    res.send({login: false})
    return
  }
  let rootId = function (id) {
    let rId = id
    return new Promise((resolve, reject) => {
      if (rootReg.test(rId)) {
        resolve(rId)
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .populate('root')
          .exec((err, story) => {
            if (err) {
              reject()
            }
            if (story.root) {
              resolve(story.root.id)
            } else {
              reject()
            }
          })
      } else {
        reject()
      }
    })
  }
  let exe = async function () {
    try {
      let id = await rootId(req.body.id)
      User.findOne({username: user})
        .exec((err, userId) => {
          if (err) {
            res.send({login: true, success: false})
          }
          if (userId) {
            Root.findOneAndUpdate({id: id}, {$pull: {'subscribe': userId._id}}, (err2, root) => {
              if (err2) {
                res.send({login: false, success: false})
              }
              for (let i = 0; i < userId.subscribe.length; i++) {
                if (userId.subscribe[i].toString() === root._id.toString()) {
                  userId.subscribe.splice(i, 1)
                  break
                }
              }
              userId.save((err3) => {
                if (err3) {
                  console.log(err3)
                }
                res.send({login: true, success: true})
              })
            })
          } else {
            res.send({login: false, success: false})
          }
        })
    } catch (e) {
      res.send({login: true, success: false})
    }
  }
  exe()
})
router.get('/story/getDefaultDiscovery', (req, res) => {
  'use strict'
  let result = []
  let existLength = req.query.storyLength * 8
  Root.find({})
    .populate({
      path: 'author'
    })
    .limit(8)
    .skip(existLength)
    .exec((err, root) => {
      if (err) {
        res.send({error: true, type: 'database', message: '发生错误请稍后再试'})
      }
      if (root) {
        if (root.length > 0) {
          root.forEach((sRoot) => {
            result.push({
              storyName: sRoot.name,
              content: sRoot.content,
              author: sRoot.author ? sRoot.author.nickname : '',
              date: moment(sRoot.date).format('YYYY.MM.DD HH:mm'),
              path: sRoot.id,
              cover: tool.formImg(sRoot.coverImg)
            })
          })
          res.send({result: result})
        } else {
          res.send({result: result})
        }
      } else {
        res.send({result: result})
      }
    })
})
router.get('/story/getNextNode', (req, res) => {
  'use strict'
  let fid = req.query.id
  if (rootReg.test(fid)) {
    let stack = []
    let storyList = []
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
        while (p || stack.length) {
          if (p) {
            _temp = await getObj(p)
            storyList.push({
              _id: _temp._id,
              id: _temp.id,
              content: _temp.content
            })
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
      }
      exe(root)
    })
    // 得到storyList
    // if(root.lc) {
    //
    // } else {
    //   // rootLc不存在
    // }
  }
})
router.get('/story/prepareTraversal', (req, res) => {
  'use strict'
  const fid = req.query.id
  function expFun (rank) {    // 经验函数
    return 1 / Math.exp(rank - 1)
  }
  function rank (arr, name) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j][name] < arr[j + 1][name]) {
          let swap = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = swap
        }
      }
    }
  }
  function nodeRankWeight (weight = 0.1, candidate) {
    candidate.forEach((c, index) => {
      c.nodeWeight = weight * expFun(index + 1)
    })
  }
  function zanRankWeight (weight = 0.2, candidate) {
    candidate.forEach((c, index) => {
      c.zanWeight = weight * expFun(index + 1)
    })
  }
  function timeRankWeight (weight = 0.2, candidate) {
    candidate.forEach((c, index) => {
      c.timeWeight = weight * expFun(index + 1)
    })
  }
  function selfCreateRankWeight (weight = 1, candidate) {
    for (let i = 0; i < candidate.length; i++) {
      if (candidate[0].selfCreate === 0) {
        candidate[i].selfWeight = 0
      } else {
        candidate[i].selfWeight = weight * expFun(i + 1)
      }
    }
  }
  function friendCreateRankWeight (weight = 0.5, candidate) {
    for (let i = 0; i < candidate.length; i++) {
      if (candidate[0].friendCreate === 0) {
        candidate[i].friendWeight = 0
      } else {
        candidate[i].friendWeight = weight * expFun(i + 1)
      }
    }
  }
  const getObj = function (id) {
    return new Promise((resolve, reject) => {
      Story.findOne({_id: id})
        .populate('author')
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
  const getObjById = function (id) {
    return new Promise((resolve, reject) => {
      Story.findOne({id: id})
        .exec((err, story) => {
          if (err) {
            console.log(err)
          }
          if (story) {
            resolve(story)
          } else {
            Root.findOne({id: id}, (err, root) => {
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
  const getFriendList = function (user) {
    return new Promise((resolve, reject) => {
      User.findOne({username: user})
        .exec((err, doc) => {
          if (err) {
            console.log(err)
            reject('error')
          } else {
            resolve(doc.friendList)
          }
        })
    })
  }
  let stack = []
  let storyList = []
  let p
  async function exe () {
    async function traversal (root) { // 先序遍历
      p = root._id
      let _temp
      while (p || stack.length) {
        if (p) {
          _temp = await getObj(p)
          storyList.push({
            _id: _temp._id,
            id: _temp.id,
            content: _temp.content
          })
          stack.push({
            _id: _temp._id,
            // id: _temp.id,
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
      return storyList
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
    async function buildCandidate () {
      async function peopleCreate (arr, stlist) {
        return new Promise((resolve, reject) => {
          (async function () {
            let user
            if (req.session.user) {
              user = req.session.user
            } else if (req.cookies.And) {
              user = req.cookies.And.user
            }
            for (let i = 0; i < arr.length; i++) {
              if (i === 0) {
                for (let j = stlist.length - 1; j > arr[0].index; j--) {
                  let q = await getObj(stlist[j])
                  if (q.author.username === user) {
                    arr[i].selfCreate ++
                  }
                  let yourFriendList = await getFriendList(user)
                  for (let k = 0; k < yourFriendList.length; k++) {
                    if (yourFriendList[k].friend.toString() === q.author._id.toString()) {
                      arr[i].friendCreate ++
                    }
                  }
                }
              } else {
                for (let j = arr[i - 1].index - 1; (arr[i - 1].index > arr[i].index) && (j > arr[i].index); j--) {
                  let q = await getObj(stlist[j])
                  if (q.author.username === user) {
                    arr[i].selfCreate ++
                  }
                  let yourFriendList = await getFriendList(user)
                  for (let k = 0; k < yourFriendList.length; k++) {
                    if (yourFriendList[k].friend.toString() === q.author._id.toString()) {
                      arr[i].friendCreate ++
                    }
                  }
                }
              }
            }
            resolve(arr)
          })()
        })
      }
      let root = await getRootObj()
      traversal(root).then((stlist) => {
        (async function () {
          let q = await getObjById(fid)
          if (q && q.lc) {
            let p = q.lc
            let candidate = []
            let _temp
            while (p) {   // 获取第二层所有节点并推入候选
              _temp = await getObj(p)
              candidate.push(
                {
                  _id: p,
                  id: _temp.id,
                  content: _temp.content,
                  zan: _temp.zan.length,
                  index: 0,
                  nodeNum: 0,
                  selfCreate: 0,
                  friendCreate: 0
                }
              )
              p = _temp.rb
            }
            for (let i = 0; i < candidate.length; i++) {   // 获取候选元素的index
              for (let j = 0; j < stlist.length; j++) {
                if (candidate[i]._id.toString() === stlist[j]._id.toString()) {
                  candidate[i].index = j
                }
              }
            }
            for (let i = candidate.length - 1; i > -1; i--) {   // 计算各节点的下属分支数
              if (i === candidate.length - 1) {
                candidate[i].nodeNum = stlist.length - candidate[i].index - 1
              } else {
                candidate[i].nodeNum = candidate[i + 1].index - candidate[i].index - 1
              }
            }
            candidate = candidate.reverse()
            timeRankWeight(0.2, candidate) // 时序排名
            rank(candidate, 'index')
            rank(await peopleCreate(candidate, stlist), 'selfCreate')
            selfCreateRankWeight(0.5, candidate)
            rank(candidate, 'friendCreate')
            friendCreateRankWeight(0.5, candidate)
            rank(candidate, 'nodeNumber')   // 节点数量排名函数
            nodeRankWeight(0.1, candidate)    // 节点权重函数
            rank(candidate, 'zan')
            zanRankWeight(0.2, candidate)
            for (let i = 0; i < candidate.length; i++) {
              candidate[i].sumWeight = candidate[i].timeWeight + candidate[i].zanWeight + candidate[i].selfWeight + candidate[i].friendWeight + candidate[i].nodeWeight
            }
            rank(candidate, 'sumWeight')
            let result = []
            candidate.forEach((item) => {
              result.push({
                id: item.id
              })
            })
            res.send({error: false, result: result})
          } else {
            res.send({error: false, result: []})
          }
        })()
      })
    }
    buildCandidate().catch(error => {
      if (error) {
        console.log(error)
      }
    })
  }
  exe()
})
router.get('/story/getFrontNode', (req, res) => {
  const fid = req.query.id
  let stack = []
  let storyList = []
  let p
  let tempObj
  let nIndex = 0
  let frontNode
  const getObj = function (id) {
    return new Promise((resolve, reject) => {
      Story.findOne({_id: id})
        .populate('author')
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
  const getObjById = function (id) {
    return new Promise((resolve, reject) => {
      Story.findOne({id: id})
        .exec((err, story) => {
          if (err) {
            console.log(err)
          }
          if (story) {
            resolve(story)
          } else {
            Root.findOne({id: id}, (err, root) => {
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
  async function exe () {
    async function traversal (root) { // 先序遍历
      p = root._id
      let _temp
      while (p || stack.length) {
        if (p) {
          _temp = await getObj(p)
          storyList.push({
            _id: _temp._id,
            id: _temp.id,
            content: _temp.content
          })
          stack.push({
            _id: _temp._id,
            // id: _temp.id,
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
      return storyList
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
    let root = await getRootObj()
    traversal(root).then(stlist => {
      let loopList
      for (let i = 0; i < stlist.length; i++) {
        if (stlist[i].id === fid) {
          loopList = stlist.slice(0, i + 1)
          break
        }
      }
      loopList.reverse()
      function getFront () {
        (async function () {
          tempObj = await getObjById(fid)
          for (let i = 0; i < loopList.length; i++) {
            if (tempObj) {
              let _tp = await getObjById(loopList[i].id)
              if (_tp.rb && _tp.rb.toString() === tempObj._id.toString()) {
                tempObj = _tp
                nIndex = i
              }
            }
          }
          if (loopList.length > 1) {
            frontNode = await getObjById(loopList[nIndex + 1].id)
          } else {
            frontNode = null
          }
          let result = null
          if (frontNode) {
            result = frontNode.id
          }
          res.send({result: result})
        })()
      }
      getFront()
    })
  }
  exe()
})
router.post('/story/updateCover', function (req, res) {
  const form = new formidable.IncomingForm()
  const imgPath = path.resolve(__dirname, '../picture/cover/')   // 图片保存路径
  // const targetPath = path.join(__dirname, './../tempPic/')      // 暂存路径/
  const proPath = path.join(__dirname, '../../dist/static/thumb/cover/')    // 生产环境图片路径
  const thumbPath = path.join(__dirname, '../../static/thumb/cover/')
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
      res.send({error: true, type: 'db', message: '发生错误，修改失败'})
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
    Root.findOneAndUpdate({name: fields.rootName}, {$set: {'coverImg': savePath}})
      .exec((err, root) => {
        if (err) {
          res.send({error: true, type: 'DB', message: '发生错误，上传失败'})
        } else {
          gm(savePath)
            .thumb(300, 400, thumbSavePath, 80, function (err) {
              if (err) {
                res.send({error: false, type: 'gm', message: '发生错误'})
              } else {
                copyIt(thumbSavePath, usePath)     // 拷贝文件
                if (root) {
                  tool.clearFiles(root.coverImg)
                }
                res.send({error: false, message: '修改成功', result: tool.formImg(savePath)})
              }
            })
        }
      })
  })
})
router.post('/story/getStoryBrief', (req, res) => {
  const story = req.body.story
  let result = []
  async function getContent (id) {
    return new Promise((resolve, reject) => {
      if (rootReg.test(id)) {
        Root.findOne({id: id})
          .exec((err, root) => {
            if (err) {
              reject(null)
            } else {
              if (root) {
                resolve(root.content)
              } else {
                reject(null)
              }
            }
          })
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .exec((err, story) => {
            if (err) {
              reject(null)
            } else {
              resolve(story.content)
            }
          })
      }
    })
  }
  async function exe () {
    try {
      for (let i = 0; i < story.length; i++) {
        let content = await getContent(story[i].storyId)
        result[i] = content.slice(0, 40)
      }
      res.send({error: false, result: result})
    } catch (e) {
      if (e) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
    }
  }
  exe()
})
router.post('/story/search', (req, res) => {
  let active = req.body.active
  let content = req.body.content
  let result = []
  async function getPeople (id) {
    return new Promise((resolve, reject) => {
      User.findOne({_id: id})
        .exec((err, user) => {
          if (err) {
            reject(false)
          } else {
            resolve(user.nickname)
          }
        })
    })
  }
  if (active === 'author') {
    // let reg = new RegExp(content, 'gi')
    // User.find({nickname: {$regex: reg}})
    //   .sort('nickname')
    //   .exec((err, user) => {
    //     if (err) {
    //       res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
    //     } else {
    //       user.forEach(item => {
    //         result.push({
    //           name: item.nickname,
    //           head: tool.formImg(item.headImg),
    //           id: user.id
    //         })
    //       })
    //       res.send({error: false, result: result})
    //     }
    //   })
    (async function () {
      const response = await client.search({
        index: 'andromeda.users',
        type: '_doc',
        body: {
          query: {
            match: {
              nickname: content
            }
          },
          highlight: {fields: {nickname: {}}}
        }
      })
      for (const item of response.hits.hits) {
        result.push({
          name: item.highlight.nickname[0],
          head: tool.formImg(item._source.headImg),
          id: item._source.id
        })
      }
      res.send({error: false, result: result})
    })()
  } else if (active === 'title') {
    (async function () {
      const response = await client.search({
        index: 'andromeda.storyroots',
        type: '_doc',
        body: {
          query: {
            match: {
              name: content
            }
          },
          highlight: {fields: {name: {}}}
        }
      })
      for (const item of response.hits.hits) {
        result.push({
          coverImg: tool.formImg(item._source.coverImg),
          name: item.highlight.name[0],
          content: item._source.content,
          subNumber: item._source.subscribe.length,
          date: moment(item._source.date).format('YYYY年M月D日 HH:mm'),
          author: await getPeople(mongoose.Types.ObjectId(item._source.author)),
          id: item._source.id
        })
      }
      res.send({error: false, result: result})
    })()
  } else if (active === 'content') {
    (async function () {
      const response = await client.search({
        index: 'andromeda.storyroots',
        type: '_doc',
        body: {
          query: {
            match: {
              content: content
            }
          },
          highlight: {fields: {content: {}}}
        }
      })
      const storyRes = await client.search({
        index: 'andromeda.stories',
        type: '_doc',
        body: {
          query: {
            match: {
              content: content
            }
          },
          highlight: {fields: {content: {}}}
        }
      })
      for (const item of response.hits.hits) {
        result.push({
          coverImg: tool.formImg(item._source.coverImg),
          name: item._source.name,
          content: item.highlight.content[0],
          subNumber: item._source.subscribe.length,
          date: moment(item._source.date).format('YYYY年M月D日 HH:mm'),
          author: await getPeople(mongoose.Types.ObjectId(item._source.author)),
          id: item._source.id
        })
      }
      for (const item of storyRes.hits.hits) {
        result.push({
          coverImg: tool.formImg(item._source.coverImg),
          name: item._source.name,
          content: item.highlight.content[0],
          subNumber: item._source.subscribe.length,
          date: moment(item._source.date).format('YYYY年M月D日 HH:mm'),
          author: await getPeople(mongoose.Types.ObjectId(item._source.author)),
          id: item._source.id
        })
      }
      res.send({error: false, result: result})
    })()
  }
})
module.exports = router
