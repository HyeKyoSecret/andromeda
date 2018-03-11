/**
 * Created by swallow on 2018/3/5.
 */

var add = require('../src/js/add.js')
var chai = require('chai')
var expect = chai.expect
// var chaiAsPromised = require('chai-as-promised')
// var chaiSubset = require('chai-subset')
// chai.use(chaiSubset)
// chai.use(chaiAsPromised)
var axios = require('axios')
/* eslint-disable no-undef */
describe('加法函数的测试', function () {
  it('1 加 1 应该等于 2', function () {
    expect(add(1, 1)).equal(2)
  })
  it('结果应该为数字', function () {
    expect(add(2, 4)).to.be.a('number')
  })
})
describe('异步测试', function () {
  'use strict'
  it('登录应该成功', function () {
    return axios.post('http://localhost:8088/register/login', {
      username: 'swallow',
      password: 'swallow940416'
    }).then(response => {
      return expect(response.data.message).to.equal('登录成功')
    })
  })
  // it('登录应该成功', function () {
  //   return expect(axios.post('http://localhost:8088/register/login', {
  //     username: 'swallow',
  //     password: 'swallow940416'
  //   })).to.eventually.containSubset({data: { message: '登录成功' }})
  // })
})
/* eslint-enable no-undef */

