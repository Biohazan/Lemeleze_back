const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
  postId: { type: String, required: true },
  postComments: [{
    userId: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, require: true },
    text: { type: String, require: true },
    avatar: { type: String },
    pictureUrl: { type: String },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: Array },
    usersDisliked: { type: Array }
  }]
  
})

module.exports = mongoose.model('Comments', commentsSchema)
