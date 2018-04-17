/**
 * Created by swallow on 2018/3/5.
 */

// var chai = require('chai')
// var expect = chai.expect

// var chaiSubset = require('chai-subset')
// chai.use(chaiSubset)
// chai.use(chaiAsPromised)
// var axios = require('axios')
// let value = ''
/* eslint-disable */
const supertest = require('supertest')
const api = supertest.agent('http://localhost:8088')
const should = require('should')
const express = require('express')
describe('登录测试', function () {
  it('登录应该成功', function (done) {
    api
      .post('/register/login')
      .send({
        username: 'swallow',
        password: 'swallow940416'
      })
      .expect(200, function (err, res) {
        (JSON.parse(res.text).message).should.equal('登录成功')
        done()
      })
  })
})
describe('根故事写入测试', function () {
  it('根故事写入应该成功', function (done) {
    for (let i = 0; i < 1000; i++) {
      api
        .post('/story/buildRoot')
        .send({
          rootName: `5 狗贼 ${i}`,
          rootContent: `我是故事${i}`,
          writePermit: true,
          recommend: []
        })
        .expect(200, function (err, res) {
          if (!err && i) {
            (JSON.parse(res.text).message).should.equal('发布成功')
            if (i === 9) {
              done()
            }
          }
        })
    }
  })
})
/* eslint-enable */

