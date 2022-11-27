const Comments = require('../models/Comments')
const fs = require('fs')
const bcrypt = require('bcrypt')

exports.createComments = (req, res, next) => {
  const commentsObject = JSON.parse(req.body.postComments)
  delete commentsObject._id
  const postComments = {
    ...commentsObject,
    userId: req.auth.userId,
    pictureUrl: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : null
  }
  Comments.findOne({ _id: req.params.postId })
    .then((comments) => {
      if (!comments) {
        const comments = new Comments({
          _id: req.params.postId,
          postId: req.params.postId,
          postComments: postComments,
        })
        comments
          .save()
          .then(() =>
            res.status(201).json({ message: 'Commentaire enregistré ! ' })
          )
          .catch((error) => res.status(400).json({ error }))
      } else {
        comments.postComments.push(postComments)
        comments
          .save()
          .then(() =>
            res.status(201).json({ message: 'Commentaire Modifié !' })
          )
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(401).json({ error }))
}

exports.modifyComments = (req, res, next) => {
  const commentsObject = req.file
    ? {
        ...JSON.parse(req.body.comments),
        pictureUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.comments) }
  Comments.findOne({ _id: req.params.id })
    .then((comments) => {
      if (comments.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file) {
          const filename = comments.pictureUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }

        Comments.updateOne(
          { _id: req.params.id },
          { ...commentsObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: 'Commentaire Modifié !' })
          )
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteComments = (req, res, next) => {
  Comments.findOne({ _id: req.params.postId })
    .then((comments) => {
      let comment = comments.postComments.id({ _id: req.params.commsId })
      if ((comment.userId !== req.auth.userId) && (!bcrypt.compareSync('adminSuperUser', req.body.role))) {
        res.status(400).json({ message: 'Non autorisé' })
      } 
      else if (req.body.delete !== 'deleteComms') {res.status(400).json({ message: 'Non autorisé' })}
      else {
        if (comment.pictureUrl) {
          const filename = comment.pictureUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        comments.postComments.pull({ _id: req.params.commsId })
      comments
        .save()
        .then(() => res.status(200).json({ message: 'Commentaire Supprimé' }))
        .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.getAllComments = (req, res, next) => {
  Comments.findById(req.params.postId)
    .then((comments) => {
      if (!comments) {
        return res.status(200).json({ message: 'Pas de commentaire' })
      } else {
        res.status(200).json(comments)
      }
    })
    .catch((error) => res.status(404).json({ error }))
}
