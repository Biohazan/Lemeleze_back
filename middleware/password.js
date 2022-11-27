const passwordValidator = require('password-validator')

const schemaPassword = new passwordValidator()
    .is().min(8, "Le mot de passe doit avoir minimum 8 caractères")  // Minimum length 8
    .is().max(50, "Le mot de passe doit avoir maximum 50 caractères")                                  // Maximum length 50
    .has().uppercase(1, "Le mot de passe doit avoir une majuscule")                              // Must have uppercase letters
    .has().lowercase(1, "Le mot de passe doit avoir un minuscule")                              // Must have lowercase letters
    .has().digits(1, "Le mot de passe doit avoir un chiffre")                                // Must have at least 1 digits
    .has().not().spaces(0, "Le mot de passe ne doit pas avoir d'espace") 

module.exports =  (req, res, next) =>{
    const userObject = JSON.parse(req.body.signup)
    if (schemaPassword.validate(userObject.password)){
        next()
    } else {
        let errorPasswordArray = []
        schemaPassword.validate(userObject.password, {details : true})
        .forEach(element => {
            errorPasswordArray.push(element.message)
        })
    return res.status(400).json({error: errorPasswordArray})
    }

} 
    