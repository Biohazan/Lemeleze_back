const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const dishCtrl = require('../controllers/dish')

router.post('/', auth, multer, dishCtrl.createDish)
router.put('/:id', auth, multer, dishCtrl.modifyDish)
router.delete('/:id', auth, multer, dishCtrl.deleteDish)
router.get('/:id', auth, dishCtrl.getOneDish);
router.get('/', dishCtrl.getAllDishs);
// router.post('/:id/like', auth, dishCtrl.likeDish)


module.exports = router