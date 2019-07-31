/**
 * Created by YYW on 2017/3/18.
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
// const uri = `mongodb://swallow:andromeda2019@localhost:27017,localhost:27027,localhost:27037/andromeda?replicaSet=-and1`
// // mongoose.connect('mongodb://localhost:27017', {
// //   useMongoClient: true
// // })
const uri = `mongodb://dds-bp1d8f62164c11741.mongodb.rds.aliyuncs.com:3717,dds-bp1d8f62164c11742.mongodb.rds.aliyuncs.com:3717/andromeda?replicaSet=mgset-15825331`
// mongoose.connect('mongodb://localhost:27017', {
//   useMongoClient: true
// })
const options = {
  useMongoClient: true
}

mongoose.connect(uri, options)
module.exports = mongoose
