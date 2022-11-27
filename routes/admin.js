const express = require('express')
const router = express.Router()
const adminCtrl = require('../controllers/admin')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


router.post('/',auth , multer, adminCtrl.isAdmin)

module.exports = router