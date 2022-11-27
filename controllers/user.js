const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')

exports.signup = (req, res, next) => {
  const userObject = JSON.parse(req.body.signup)
  bcrypt
    .hash(userObject.password, 10)
    .then((hash) => {
      const user = new User({
        ...userObject,
        password: hash,
        role: bcrypt.hashSync('user', 10),
      })
      user
        .save()
        .then(() =>
          res.status(201).json({
            userId: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.RANDOM_TOKEN_SECRET}`,
              { expiresIn: '24h' }
            ),
            message: 'Utilisateur créé !',
          })
        )
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  const userObject = JSON.parse(req.body.login)
  User.findOne({ email: userObject.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: 'Paire identifiant / mot de passe incorecte' })
      } else {
        bcrypt
          .compare(userObject.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: 'Paire identifiant / mot de passe incorecte' })
            } else {
              res.status(200).json({
                userId: user._id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token: jwt.sign(
                  { userId: user._id },
                  `${process.env.RANDOM_TOKEN_SECRET}`,
                  { expiresIn: '24h' }
                ),
              })
            }
          })
          .catch((error) => res.status(500).json({ error }))
      }
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' })
      } else if (req.params.userId === req.auth.userId) {
        res.status(200).json(user)
      } else {
        const publicUser = { ...user }
        delete publicUser._doc.password
        delete publicUser._doc._id
        delete publicUser._doc.email
        delete publicUser._doc.__v
        res.status(200).json(publicUser._doc)
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...JSON.parse(req.body.profile),
        avatar: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : req.body.password
    ? { ...JSON.parse(req.body.password) }
    : { ...JSON.parse(req.body.profile) }

  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user._id.toString() !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
        // Password Modify
      } else if (req.body.password) {
        bcrypt.compare(userObject.old, user.password).then((valid) => {
          if (!valid) {
            res
              .status(401)
              .json({ message: 'Paire identifiant / mot de passe incorecte' })
          } else
            bcrypt.hash(userObject.new, 10).then((hash) => {
              User.updateOne(
                { _id: req.params.userId },
                { password: hash, _id: req.params.userId }
              )
                .then(() =>
                  res.status(200).json({
                    passModify: 'ok',
                    message: 'Mot de passe modifié ',
                  })
                )
                .catch((error) => res.status(400).json({ error }))
            })
        })
        // Picture, pseudo and describe modify
      } else {
        if (
          // Check if avatar isn't the default picture
          req.file &&
          user.avatar !==
            `${req.protocol}://${req.get('host')}/images/defaultPicture.png`
        ) {
          const filename = user.avatar.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        User.updateOne(
          { _id: req.params.userId },
          { ...userObject, _id: req.params.userId }
        )
          .then(() => {
            if (req.file) {
              res.status(200).json({
                avatar: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
                }`,
                message: 'Utilisateur Modifié !',
              })
            } else
              res
                .status(200)
                .json({ avatar: user.avatar, message: 'Utilisateur Modifié !' })
          })
          .catch((error) => res.status(402).json({ error }))
      }
    })
    .catch((error) => res.status(401).json({ error }))
}

exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user._id.toString() !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        bcrypt.compare(req.body.password, user.password).then((valid) => {
          if (!valid) {
            res
              .status(401)
              .json({ message: 'Paire identifiant / mot de passe incorecte' })
          } else {
            if (
              user.avatar &&
              user.avatar !==
                `${req.protocol}://${req.get('host')}/images/defaultPicture.png`
            ) {
              const filename = user.avatar.split('/images')[1]
              fs.unlink(`images/${filename}`, () => {
                console.log('Image supprimé')
              })
            }
            User.deleteOne({ _id: req.params.userId })
              .then(() =>
                res.status(200).json({ message: 'Utilisateur Supprimé !' })
              )
              .catch((error) => res.status(401).json({ error }))
          }
        })
      }
    })
    .catch((error) => res.status(500).json({ error }))
}
