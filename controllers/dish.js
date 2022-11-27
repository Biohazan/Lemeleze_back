const Dish = require('../models/Dish')
const fs = require('fs')
const bcrypt = require('bcrypt')

exports.createDish = (req, res, next) => {
  const dishObject = JSON.parse(req.body.dish)
  delete dishObject._id
  delete dishObject.userId
  const dish = new Dish({
    ...dishObject,
    userId: req.auth.userId,
    picture: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : null,
  })
  dish
    .save()
    .then(() => res.status(201).json({ message: 'Plat enregistré ! ' }))
    .catch((error) => res.status(400).json({ error }))
}

// Route PUT dish
exports.modifyDish = (req, res, next) => {
  const dishObject = req.file
    ? {
        ...JSON.parse(req.body.dish),
        picture: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.dish) }
  Dish.findOne({ _id: req.params.id })
    .then((dish) => {
      if (
        !bcrypt.compareSync(process.env.ADMIN_BCRYPT_COMPARE, req.body.role)
      ) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file && dish.picture) {
          const filename = dish.picture.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        Dish.updateOne(
          { _id: req.params.id },
          { ...dishObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Plat Modifié !' }))
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error: 'error' }))
}

// Route DELETE Dish
exports.deleteDish = (req, res, next) => {
  Dish.findOne({ _id: req.params.id })
    .then((dish) => {
      if (
        dish.userId !== req.auth.userId &&
        !bcrypt.compareSync(process.env.ADMIN_BCRYPT_COMPARE, req.body.role)
      ) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (dish.picture) {
          const filename = dish.picture.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        Dish.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Plat Supprimé !' }))
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(500).json({ error }))
}

// Route GET Dish
exports.getOneDish = (req, res, next) => {
  Dish.findById(req.params.id)
    .then((dish) => {
      if (!dish) {
        res.status(404).json({ message: 'Plat non trouvé' })
      } else {
        res.status(200).json(dish)
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllDishs = (req, res, next) => {
  Dish.find()
    .then((allDishs) => res.status(200).json(allDishs))
    .catch((error) => res.status(400).json({ error }))
}

// Route like post
