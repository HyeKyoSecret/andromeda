const express = require('express')
const User = require('../db/User')
const Root = require('../db/StoryRoot')
const Story = require('../db/Story')
const History = require('../db/History')
const moment = require('moment')
const router = express.Router()
const tool = require('../tool')
router.post('/history/addHistory', (req, res) => {
  let id = req.body.id
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  const rootReg = /^R([0-9]){7}$/
  const storyReg = /^S([0-9]){7}$/
  let now = new Date()
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  let history
  async function getRootId () {
    return new Promise((resolve, reject) => {
      if (rootReg.test(id)) {
        Root.findOne({id: id})
          .exec((err, root) => {
            if (err) {
              console.log(err)
            }
            if (root) {
              resolve(root._id)
            } else {
              reject(null)
            }
          })
      } else if (storyReg.test(id)) {
        Story.findOne({id: id})
          .populate('root')
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
                    resolve(root._id)
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
    .populate('history')
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
      } else {
        if (doc) {
          if (doc.history) {  // 存在历史
            if (doc.history.data[doc.history.data.length - 1].date.getTime() === today.getTime()) { // 当前记录中最新的项目是否是今天
              (async function () {
                let tempHistory = doc.history.data
                let newHistory = tempHistory[tempHistory.length - 1]
                let rootId = await getRootId()
                let flag2 = false
                for (let i = 0; i < newHistory.rootPack.length; i++) {
                  if (newHistory.rootPack[i].rootId.toString() === rootId.toString()) {
                    flag2 = true
                    let flag = false
                    newHistory.rootPack[i].story.forEach((item, index) => {
                      if (item.storyId === id) {
                        item.date = now
                        newHistory.rootPack[i].update = now
                        flag = true
                      }
                      if (!flag && index === newHistory.rootPack[i].story.length - 1) {
                        newHistory.rootPack[i].story.push({
                          storyId: id,
                          date: now
                        })
                        newHistory.rootPack[i].update = now
                      }
                    })
                  }
                  if (!flag2 && i === newHistory.rootPack.length - 1) {
                    newHistory.rootPack.push({
                      rootId: rootId,
                      story: [{
                        storyId: id,
                        date: now
                      }],
                      update: now
                    })
                  }
                }
                tempHistory[tempHistory.length - 1] = newHistory
                History.findOne({_id: doc.history})
                  .exec((hisErr, history) => {
                    if (hisErr) {
                      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                    } else {
                      history.data = tempHistory
                      history.save(err4 => {
                        if (err4) {
                          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                        } else {
                          res.send({error: false})
                        }
                      })
                    }
                  })
              })()
            } else {
              (async function () {
                let tempHistory = doc.history.data
                let rootId = await getRootId()
                tempHistory.push({
                  date: today,
                  rootPack: [
                    {
                      rootId: rootId,
                      story: [{
                        storyId: id,
                        date: now
                      }],
                      update: now
                    }
                  ]
                })
                History.findOne({_id: doc.history})
                  .exec((hisErr, history) => {
                    if (hisErr) {
                      res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                    } else {
                      history.data = tempHistory
                      history.save(err4 => {
                        if (err4) {
                          res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
                        } else {
                          res.send({error: false})
                        }
                      })
                    }
                  })
              })()
            }
          } else {  // 不存在历史
            (async function () {
              history = {
                data: [{
                  date: today,
                  rootPack: [
                    {
                      rootId: await getRootId(),
                      story: [{
                        storyId: id,
                        date: now
                      }],
                      update: now
                    }
                  ]
                }]
              }
              let newHistory = new History(history)
              newHistory.save(function (hiserr, newHis) {
                if (hiserr) {
                  res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
                } else {
                  User.updateOne({username: user}, {$set: {'history': newHis._id}})
                    .exec((err2) => {
                      if (err2) {
                        res.send({error: true, type: 'DB', message: '发生错误,请稍后再试'})
                      } else {
                        res.send({error: false})
                      }
                    })
                }
              })
            })()
          }
        } else {
          res.send({error: false})
        }
      }
    })
})
router.get('/history/getHistory', (req, res) => {
  let id = req.query.id
  let val = req.query.val
  let result = []
  let user
  if (req.session.user) {
    user = req.session.user
  } else if (req.cookies.And) {
    user = req.cookies.And.user
  }
  function bubbleSort (arr) {   // 排序算法，从大到小
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].updateTime.getTime() < arr[j + 1].updateTime.getTime()) {
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    return arr
  }
  function dateBubbleSort (arr) {   // 排序算法，从大到小
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].time.getTime() < arr[j + 1].time.getTime()) {
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    return arr
  }
  let now = new Date()
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  User.findOne({id: id})
    .populate('history')
    .populate({
      path: 'history',
      populate: {
        path: 'data.rootPack.rootId'
      }
    })
    .exec((err, doc) => {
      if (err) {
        res.send({error: true, type: 'DB', message: '发生错误，请稍后再试'})
      }
      if (doc && doc.username === user) {
        let beginNumber = (doc.history && doc.history.data.length) ? doc.history.data.length - 1 - 4 * val : 0
        let endNumber = (doc.history && doc.history.data.length) ? doc.history.data.length - 4 * val - 4 : 0
        if (endNumber < 0) {
          endNumber = 0
        }
        for (let i = beginNumber; i >= endNumber; i--) {
          let m = beginNumber - i
          if (doc.history.data[i].date.getTime() === today.getTime()) {
            result.push({
              date: '今天',
              rootPack: []
            })
          } else {
            result.push({
              date: moment(doc.history.data[i].date).fromNow(),
              rootPack: []
            })
          }
          for (let j = 0; j < doc.history.data[i].rootPack.length; j++) {
            result[m].rootPack[j] = {
              rootId: doc.history.data[i].rootPack[j].rootId.name,
              coverImg: tool.formImg(doc.history.data[i].rootPack[j].rootId.coverImg),
              story: [],
              update: moment(doc.history.data[i].rootPack[j].update).format('HH:mm'),
              updateTime: doc.history.data[i].rootPack[j].update,
              showList: false
            }
            for (let k = 0; k < doc.history.data[i].rootPack[j].story.length; k++) {
              result[m].rootPack[j].story[k] = {
                storyId: doc.history.data[i].rootPack[j].story[k].storyId,
                date: moment(doc.history.data[i].rootPack[j].story[k].date).fromNow(),
                time: doc.history.data[i].rootPack[j].story[k].date
              }
            }
            dateBubbleSort(result[m].rootPack[j].story)
          }
          bubbleSort(result[m].rootPack)
        }
        console.log(result)
        res.send({error: false, result: result})
      } else {
        if (typeof id === 'undefined') {
          res.send({error: false, result: []})
        } else {
          res.send({error: true, type: 'auth', message: '发生错误'})
        }
      }
    })
})
module.exports = router
