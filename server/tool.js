const fs = require('fs')
const path = require('path')
const User = require('./db/User')
const Root = require('./db/StoryRoot')
const Story = require('./db/Story')
exports.formImg = function (imgPath) {
  if (imgPath) {
    let macPath = imgPath.split('/andromeda/server/picture')
    let winPath = imgPath.split('\\andromeda\\server\\picture')
    if (winPath.length > 1) {
      return '\\static\\thumb' + winPath[1]
    } else if (macPath.length > 1) {
      return '/static/thumb' + macPath[1]
    } else {
      return 'default'
    }
  } else {
    return 'default'
  }
}
exports.getFileName = function (path) {
  let windowsPath = path.split('\\')
  let macPath = path.split('/')
  if (path && windowsPath.length > 1) {
    return windowsPath[windowsPath.length - 1]
  } else if (path && macPath.length > 1) {
    return macPath[macPath.length - 1]
  } else {
    return null
  }
}
exports.clearFiles = function (imgPath) {
  if (imgPath) {
    let macPath = imgPath.split('/server/picture')
    let winPath = imgPath.split('\\server\\picture')
    let staticThumb, distThumb
    if (macPath.length > 1 && fs.existsSync(imgPath)) {
      staticThumb = winPath[0] + '/static/thumb' + winPath[1]
      distThumb = winPath[0] + '/dist/static/thumb' + winPath[1]
    }
    if (winPath.length > 1 && fs.existsSync(imgPath)) {
      staticThumb = winPath[0] + '\\static\\thumb' + winPath[1]
      distThumb = winPath[0] + '\\dist\\static\\thumb' + winPath[1]
    }
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath)
    }
    if (fs.existsSync(staticThumb)) {
      fs.unlinkSync(staticThumb)
    }
    if (fs.existsSync(distThumb)) {
      fs.unlinkSync(distThumb)
    }
  }
}
exports.getRootInfo = function (fid, callback) {
  'use strict'
  console.log('接收到的fid' + fid)
  let stack = []
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
      let count = {
        nodeCount: 0, // 总结点数量
        zanCount: 0, // 故事被赞总量
        readCount: 0  // 故事阅读总量
      }
      while (p || stack.length) {
        if (p) {
          _temp = await getObj(p)
          count.nodeCount = count.nodeCount + 1
          count.zanCount += _temp.zan ? _temp.zan.length : 0
          count.readCount += _temp.readCount ? _temp.readCount.length : 0
          stack.push({
            _id: _temp._id,
            id: _temp.id,
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
      callback(count)
    }
    exe(root)
  })
}
