const validator = require('email-validator')

module.exports =  (req, res, next) =>{
    const userObject = JSON.parse(req.body.signup)
    if (validator.validate(userObject.email)){
        next()
    } else  return res.status(400).json({error: "L'adresse mail est invalide"})
    
}