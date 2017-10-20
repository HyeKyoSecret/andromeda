/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const User = require('../db/User')
const router = express.Router()
// router.post('/story/buildRoot', (req, res) => {
//   let rootName = req.body.rootName
//   let rootStory = {
//     name: rootName
//   }
//   let newRoot = new Root(rootStory)
//   newRoot.save((err) => {
//     if (err) {
//       console.log(err)
//     } else {
//       res.send('ok')
//     }
//   })
// })
router.post('/story/buildRoot', (req, res) => {
  let rootName = req.body.rootName
  let rootContent = req.body.rootContent
  let writePermit = req.body.writePermit
  let author = req.session.user || req.cookies.And.user
  if (author) {
    let rootStory = {
      name: rootName.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),
      content: rootContent.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt'),
      writeOpen: writePermit
    }
    User.findOne({username: author}, (err, user) => {
      'use strict'
      if (err) {
        res.send({permit: false, message: '服务器忙，请稍后再试'})
      } else {
        rootStory.author = user._id
        let newRoot = new Root(rootStory)
        newRoot.save((err, root) => {
          if (err) {
            console.log(err)
            res.send({permit: false, message: '服务器忙，请稍后再试'})
          } else {
            console.log('root' + user.myCreation.root)
            console.log('root_id' + root._id)
            user.myCreation.root.push(root._id)
            user.save((error) => {
              if (error) {
                console.log(error)
                res.send({permit: false, message: '服务器忙，请稍后再试'})
              } else {
                res.send({permit: true, message: '发布成功'})
              }
            })
          }
        })
      }
    })
  } else {
    res.send({permit: false, message: '没有权限操作'})
  }
  // let
  // let rootStory = {
  //   name: rootName
  // }
  // let newRoot = new Root(rootStory)
  // newRoot.save((err) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     res.send('ok')
  //   }
  // })
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
router.post('/story/buildStory', (req, res) => {
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
router.get('/checkRootName', (req, res) => {
  'use strict'
  let name = req.query.name
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
module.exports = router
