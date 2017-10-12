/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const router = express.Router()
router.post('/story/buildRoot', (req, res) => {
  let rootName = req.body.rootName
  let rootStory = {
    name: rootName
  }
  let newRoot = new Root(rootStory)
  newRoot.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.send('ok')
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
        .exec((err, root) => {
          if (err) {
            console.log(err)
          } else {
            if (root) {    // 前驱结点是根节点
              console.log('前驱结点是根节点')
              if (root.lc) {   // 根节点非空
                console.log('根节点lc指向' + 'aaa' + root.lc)
                console.log('开始查找根节点的lc')
                Story.find({_id: root.lc})
                  .exec((err, story) => {
                    if (err) {
                      console.log(err)
                    } else {
                      if (story) {
                        console.log('找到根节点的lc')
                        let p = story.rb
                        console.log('p结点赋值' + p)

                        let changeP = function() {
                          return new Promise(function (resolve, reject) {
                            Story.find({_id: p}, (error, nStory) => {
                              if (error) {
                                console.log(error)
                              } else {
                                p = nStory.rb
                                if (!p) {
                                  console.log('p已置空')
                                  p = doc._id
                                  console.log('p的新值' + doc._id)
                                  nStory.save((err3) => {
                                    if (err3) {
                                      console.log(err3)
                                    }else{
                                      console.log('写入成功')
                                      res.send('okhahha')
                                    }
                                  })
                                }
                                resolve(p)
                                reject('error+++++!!')
                              }
                            })
                          })
                        }

                        let search = async function() {
                          // while (p) {
                          //   console.log('fffff' + await changeP())
                          // }
                          // if (!p) {
                          //   p = doc._id
                          //   story.save((err4) => {
                          //     if (err4) {
                          //       console.log(err4)
                          //     }
                          //   })
                          // }
                          console.log('search'+ p)
                        }

                        search()

                      } else {
                        console.log('根节点的lc故事出错')
                      }
                    }
                  })
              } else {
                console.log('根节点的lc为空')
                root.lc = doc._id
                root.save((err) => {
                  console.log(err)
                })
              }
            }
          }
        })
    }
  })
})
module.exports = router
