/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const Root = require('../db/StoryRoot')
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
module.exports = router
