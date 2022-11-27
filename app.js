const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const dishRoutes = require('./routes/dish')
const userRoutes = require('./routes/user')
const commentsRoutes = require('./routes/comments')
const adminRoutes = require('./routes/admin')
require('dotenv').config()

const app = express()
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOOSE_LOGIN}:${process.env.MONGOOSE_PASS}@${process.env.MONGOOSE_URL}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTION'
  )
  next()
})

app.use('/api/comments', commentsRoutes)
app.use('/api/dish', dishRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/images', express.static('./images'))

module.exports = app
