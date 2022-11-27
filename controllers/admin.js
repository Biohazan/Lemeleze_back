const bcrypt = require('bcrypt')
require('dotenv').config()

exports.isAdmin = (req, res, next) => {
    const adminObject = JSON.parse(req.body.admin)
    bcrypt
    .compare(process.env.ADMIN_BCRYPT_COMPARE, adminObject)
    .then((valid) => {
        if(!valid) {
            res.status(200).json({isAdmin: false})
        }
        else
        res.status(200).json({isAdmin: true})
    })
    .catch((error) => res.status(400).json({ error }))
}