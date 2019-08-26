/**
 * Created by YYW on 2017/3/18.
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const uri = `mongodb://swallow:andromeda2019@localhost:27017,localhost:27027,localhost:27037/andromeda?replicaSet=-and1`
// const uri = `mongodb://swallow:andromeda2019@dds-j6ce3b9387afa5b41707-pub.mongodb.rds.aliyuncs.com:3717,dds-j6ce3b9387afa5b42585-pub.mongodb.rds.aliyuncs.com:3717/andromeda?replicaSet=mgset-15839819`
const options = {
  useMongoClient: true
}

mongoose.connect(uri, options)
module.exports = mongoose
