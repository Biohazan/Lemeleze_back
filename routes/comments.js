const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()

const commentsCtrl = require('../controllers/comments')

router.post('/:postId', auth, multer, commentsCtrl.createComments)
router.put('/:id', auth, multer, commentsCtrl.modifyComments)
router.post('/:postId/:commsId', auth, commentsCtrl.deleteComments)
router.get('/:postId', auth, commentsCtrl.getAllComments);

module.exports = router