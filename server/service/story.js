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
              if (root.lc) {
                Story.find({_id: root.lc})
                  .exec((err, story) => {
                    if (err) {
                      console.log(err)
                    } else {
                      if (story) {
                        let p = story.rb
                        let writeFun = function () {
                          Story.find({_id: p}, (error, nStory) => {
                            if (error) {
                              console.log(error)
                            } else {
                              p = nStory.rb
                              console.log(p.toString())
                              /* eslint-disable */
                              while (p) {
                                writeFun()
                              }
                              /* eslint-enable */
                            }
                          })
                        }
                        if (!p) {
                          writeFun()
                          p = doc._id
                          story.save((err) => {
                            console.log(err)
                          })
                        } else {
                          p = doc._id
                          story.save((err) => {
                            console.log(err)
                          })
                        }
                      }
                    }
                  })
              } else {
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
