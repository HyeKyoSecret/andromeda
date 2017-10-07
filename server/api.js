/**
 * Created by swallow on 2017/9/23.
 */
const express = require('express')
const router = express.Router()
const story = require('./service/story')
const register = require('./service/register')
router.use('/', story)
router.use('/', register)
module.exports = router
