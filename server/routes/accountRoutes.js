const express = require('express')
const controller = require('../controllers/accountController.js')

const router = express.Router()

router.get('/api/account/:access_token', controller.account_get)

module.exports = router
