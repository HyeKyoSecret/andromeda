/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const User = require('../db/User')
const router = express.Router()
const moment = require('moment')
moment.locale('zh-cn')
router.post('/story/buildRoot', (req, res) => {
  let rootName = req.body.rootName
  let rootContent = req.body.rootContent
  let writePermit = req.body.writePermit
  let author = req.session.user || req.cookies.And.user
  if (author) {
    let rootStory = {
      name: rootName.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),     // 过滤大于小于美元符号
      content: rootContent.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),
      writePermit: writePermit
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
                    user.myCreation.root.push(root._id)
                    user.save((error) => {
                      if (error) {
                        console.log(error)
                        res.send({permit: false, message: '服务器忙，请稍后再试'})
                      } else {
                        user.myCreationDraft.root.name = ''
                        user.myCreationDraft.root.content = ''
                        user.myCreationDraft.root.writePermit = true
                        user.save(saveError => {
                          if (saveError) {
                            res.send({permit: false, message: '服务器忙，请稍后再试'})
                          } else {
                            res.send({permit: true, message: '发布成功'})
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          })
      }
    })
  } else {
    res.send({permit: false, message: '没有权限操作'})
  }
})
router.get('/story/getStory', (req, res) => {
  'use strict'
  let id = req.query.id
  let rootReg = /^R([0-9]){5}$/
  let storyReg = /^S([0-9]){5}$/
  let result = {
    title: '',
    content: '',
    author: '',
    date: ''
  }
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
            result.date = moment(root.date).format('YYYY年M月D日 H:m')
            res.send({permit: true, result: result})
          } else {
            res.send({permit: false})
          }
        }
      })
  } else if (storyReg.test(id)) {
    Story.findOne({ id: id })
      .populate('root')
      .exec((err, story) => {
        if (err) {
          res.send({permit: false})
        } else {
          if (story) {
            result.title = story.root.name
            result.content = story.content
            result.author = story.author
            result.date = moment(story.date).format('YYYY年M月D日 H:m')
            res.send({permit: true, result: result})
          } else {
            res.send({permit: false})
          }
        }
      })
  } else {
    res.send({permit: false})
  }
})
router.post('/story/saveDraft', (req, res) => {
  'use strict'
  let rootName = req.body.rootName
  let rootContent = req.body.rootContent
  let writePermit = req.body.writePermit
  let author = req.session.user || req.cookies.And.user
  if (author) {
    User.findOne({username: author}, (err, user) => {
      if (err) {
        res.send({permit: false, message: '发生错误，请稍后再试'})
      } else {
        user.myCreationDraft.root.name = rootName
        user.myCreationDraft.root.content = rootContent
        user.myCreationDraft.root.writePermit = writePermit
        user.save(error => {
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
router.get('/story/getDraft', (req, res) => {
  'use strict'
  let author = req.session.user || req.cookies.And.user
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
      }
    }
  })
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
router.post('/story/xuildStory', (req, res) => {
  let ftNode = req.body.ftNode
  let nodeName = req.body.nodeName
  let node = {
    name: nodeName
  }
  let newStory = new Story(node)
  newStory.save((err, doc) => {
    if (err) {
      console.log(err)
    } else {
      Root.findOne({name: ftNode}) // 判断前趋结点是否为根节点
        .exec((errRoot, root) => {
          if (errRoot) {
            console.log(errRoot)
            res.send('error')
          } else {
            if (root) {    // 前驱结点是根节点
              console.log('前驱结点是根节点')
              if (root.lc) {   // 根节点lc非空
                console.log('根节点的 lc 非空')
                console.log('根节点 lc 指向' + root.lc)
                console.log('开始查找根节点的lc指向的故事')
                Story.findOne({_id: root.lc})
                  .exec((err, story) => {
                    if (err) {
                      console.log(err)
                      res.send('error')
                    } else {
                      if (story) {
                        console.log('找到根节点的lc所指向的故事')
                        let p = story.rb
                        console.log('p结点赋值，story.rb' + p)

                        let changeP = function () {
                          return new Promise(function (resolve, reject) {
                            Story.findOne({_id: p}, (error, nStory) => {
                              if (error) {
                                console.log(error)
                              } else {
                                p = nStory.rb
                                if (!p) {
                                  console.log('p已置空')
                                  nStory.rb = doc._id
                                  console.log('p的新值' + doc._id)
                                  nStory.save((err3) => {
                                    if (err3) {
                                      console.log(err3)
                                    } else {
                                      console.log('写入成功')
                                      res.send('ok')
                                    }
                                  })
                                }
                                resolve(p)
                                reject('error+++++!!')
                              }
                            })
                          })
                        }

                        let search = async function () {
                          while (p) {
                            p = await changeP()
                            console.log('循环中的p' + p)
                          }
                          if (!p) {
                            console.log('检测到p为空，即表明该节点的右指针为空')
                            story.rb = doc._id
                            console.log('story.rb' + story.rb)
                            story.save((err4) => {
                              if (err4) {
                                console.log(err4 + '保存失败')
                                res.send('error')
                              }
                            })
                            res.send('ok')
                          }
                        }

                        search().catch((err) => {
                          'use strict'
                          console.log('执行出现了错误' + err)
                          res.send('error')
                        })
                      } else {
                        console.log('根节点的lc故事出错')
                        res.send('error')
                      }
                    }
                  })
              } else {
                console.log('根节点的lc为空')
                root.lc = doc._id
                root.save((err) => {
                  console.log(err)
                  res.send('ok')
                })
              }
            } else {      // 前趋结点不是根节点
              console.log('前驱结点不是根节点')
              Story.findOne({name: ftNode})
                .exec((err, odstory) => {
                  'use strict'
                  if (err) {
                    console.log(err)
                    res.send('error')
                  } else {
                    if (odstory) {    // 前驱结点是普通故事结点
                      console.log('前驱结点是普通故事结点')
                      if (odstory.lc) {   // 普通故事结点lc非空
                        console.log('普通故事结点lc非空')
                        console.log('普通故事结点 lc 指向' + odstory.lc)
                        console.log('开始查找普通故事结点的lc指向的故事')
                        Story.findOne({_id: odstory.lc})
                          .exec((err, story) => {
                            if (err) {
                              console.log(err)
                              res.send('error')
                            } else {
                              if (story) {
                                console.log('找到故事结点的lc所指向的故事')
                                let p = story.rb
                                console.log('p结点赋值，story.rb' + p)
                                let changeP = function () {
                                  return new Promise(function (resolve, reject) {
                                    Story.findOne({_id: p}, (error, nStory) => {
                                      if (error) {
                                        console.log(error)
                                      } else {
                                        p = nStory.rb
                                        if (!p) {
                                          console.log('p已置空')
                                          nStory.rb = doc._id
                                          console.log('p的新值' + doc._id)
                                          nStory.save((err3) => {
                                            if (err3) {
                                              console.log(err3)
                                            } else {
                                              console.log('写入成功')
                                            }
                                          })
                                        }
                                        resolve(p)
                                        reject('error+++++!!')
                                      }
                                    })
                                  })
                                }

                                let search = async function () {
                                  while (p) {
                                    p = await changeP()
                                    console.log('循环中的p' + p)
                                  }
                                  if (!p) {
                                    console.log('检测到p为空，即表明该节点的右指针为空')
                                    story.rb = doc._id
                                    console.log('story.rb' + story.rb)
                                    story.save((err4) => {
                                      if (err4) {
                                        console.log(err4 + '保存失败')
                                        res.send('error')
                                      }
                                    })
                                    console.log(story + '12345689')
                                    res.send('ok')
                                  }
                                }

                                search().catch((err) => {
                                  'use strict'
                                  console.log('执行出现了错误' + err)
                                  res.send('error')
                                })
                              } else {
                                console.log('普通故事结点的lc故事出错')
                                res.send('error')
                              }
                            }
                          })
                      } else {
                        console.log('普通故事结点的lc为空')
                        odstory.lc = doc._id
                        odstory.save((err) => {
                          if (err) {
                            console.log(err)
                            res.send('error')
                          } else {
                            res.send('ok')
                          }
                        })
                      }
                    }
                  }
                })
            }
          }
        })
    }
  })
})
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
    // 拒绝
  }
  let story = {
    content: content,
    author: author
  }
  let newStory = new Story(story)
  newStory.save((saveErr, doc) => {
    if (saveErr) {
      // 拒绝
    }
    if (ftNode.split('')[0] === 'R') { // 从ftNode id上判断前驱节点是否是根节点
      Root.findOne({id: ftNode})
        .exec((rootErr, root) => {
          if (rootErr) {
            // 拒绝
          }
          if (root) {   // 查询到ftNode是根节点
            if (root.lc) {    // root.lc 非空
              Story.findOne({_id: root.lc})
                .exec((storyErr, story) => {
                  if (storyErr) {
                    // 拒绝
                  } else {
                    if (story) {
                      let p = story.rb     // 创建指针p 指向当前故事的rb
                      let changeP = function () {
                        return new Promise(function (resolve, reject) {
                          Story.findOne({_id: p}, (error, nStory) => {
                            if (error) {
                              console.log(error)
                            } else {
                              p = nStory.rb
                              if (!p) {
                                nStory.update({$set: {rb: doc._id}})
                                  .exec((err3) => {
                                    if (err3) {
                                      console.log(err3)
                                    }
                                    doc.update({$set: {root: nStory.root}}, (err6) => {
                                      if (err6) {
                                        console.log(err6)
                                      }
                                      res.send('ok')
                                    })
                                  })
                              }
                              resolve(p)
                              reject('error+++++!!')
                            }
                          })
                        })
                      }

                      let search = async function () {
                        if (!p) { // root的第一个子节点的rb为空
                          story.update({$set: {rb: doc._id}})
                            .exec((err4) => {
                              if (err4) {
                                console.log(err4)
                                // 拒绝
                              }
                              doc.update({$set: {root: story.root}}, (err6) => {
                                if (err6) {
                                  console.log(err6)
                                  // 拒绝
                                }
                                res.send('ok')
                              })
                            })
                        }
                        while (p) {
                          p = await changeP()
                        }
                      }

                      search().catch((err) => {
                        'use strict'
                        console.log('执行出现了错误' + err)
                        res.send('error')
                      })
                    } else {
                      console.log('根节点的lc故事出错')
                      res.send('error')
                    }
                  }
                })
            } else { // root.lc 不存在
              root.update({$set: {lc: doc._id}})
                .exec(err => {
                  if (err) {
                    console.log(err)
                  }
                  doc.update({$set: {root: root._id}}, (docErr) => {
                    if (docErr) {
                      // 拒绝
                    }
                    res.send('ok')
                  })
                })
            }
          } else {
            // 非root拒绝
          }
        })
    } else if (ftNode.split('')[0] === 'S') { // 从ftNode id上判断前驱节点是否是普通故事节点
      Story.findOne({id: ftNode})
        .exec((err, odstory) => {
          'use strict'
          if (err) {
            console.log(err)
            res.send('error')
          } else {
            if (odstory) {    // 前驱结点是普通故事结点
              if (odstory.lc) {   // 普通故事结点lc非空
                Story.findOne({_id: odstory.lc})
                  .exec((err, story) => {
                    if (err) {
                      console.log(err)
                      res.send('error')
                    } else {
                      if (story) {
                        console.log('找到' + story.name)
                        let p = story.rb
                        let changeP = function () {
                          return new Promise(function (resolve, reject) {
                            Story.findOne({_id: p}, (error, nStory) => {
                              if (error) {
                                console.log(error)
                              } else {
                                p = nStory.rb
                                if (!p) {
                                  nStory.update({$set: {rb: doc._id}})
                                    .exec((err3) => {
                                      if (err3) {
                                        console.log(err3)
                                        // 拒绝
                                      }
                                      doc.update({$set: {root: nStory.root}}, (err6) => {
                                        if (err6) {
                                          console.log(err6)
                                        }
                                        res.send('ok')
                                      })
                                    })
                                }
                                resolve(p)
                                reject('error+++++!!')
                              }
                            })
                          })
                        }

                        let search = async function () {
                          if (!p) {
                            story.update({$set: {rb: doc._id}})
                              .exec((err4) => {
                                if (err4) {
                                  console.log(err4)
                                  // 拒绝
                                }
                                doc.update({$set: {root: story.root}}, (err6) => {
                                  if (err6) {
                                    console.log(err6)
                                    // 拒绝
                                  }
                                  res.send('ok')
                                })
                              })
                          }
                          while (p) {
                            p = await changeP()
                          }
                        }

                        search().catch((err) => {
                          'use strict'
                          console.log('执行出现了错误' + err)
                          res.send('error')
                        })
                      } else {
                        res.send('error')
                      }
                    }
                  })
              } else {    // 普通故事结点.lc为空
                odstory.update({$set: {lc: doc._id}})
                  .exec(err => {
                    if (err) {
                      console.log(err)
                    }
                    doc.update({$set: {root: odstory.root}}, (docErr) => {
                      if (docErr) {
                        // 拒绝
                      }
                      res.send('ok')
                    })
                  })
              }
            }
          }
        })
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
router.get('/story/getRootPreview', (req, res) => {
  'use strict'
  let rootName = req.query.rootName
  if (rootName.length > 0 && rootName.length <= 12) {
    rootName = rootName.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt')
  }
  let rootInfo = {
    name: '',
    content: '',
    writePermit: null,
    date: ''
  }
  Root.findOne({name: rootName})
    .exec((err, root) => {
      if (err) {
        res.send({rootInfo: null})
      } else {
        if (root) {
          rootInfo.id = root.id
          rootInfo.name = root.name
          rootInfo.content = root.content
          rootInfo.writePermit = root.writePermit
          rootInfo.date = moment(root.date).format('LL')
          res.send({rootInfo: rootInfo})
        } else {
          res.send({rootInfo: null})
        }
      }
    })
})
router.post('/story/changeWritePermit', (req, res) => {
  'use strict'
  let writePermit = req.body.writePermit
  if (typeof writePermit === 'boolean') {
    Root.update({name: req.body.rootName}, {$set: {'writePermit': writePermit}})
      .exec((err) => {
        if (err) {
          res.send('error')
        } else {
          res.send('ok')
        }
      })
  }
})
module.exports = router
