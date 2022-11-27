const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    name: {type: String, require: true},
    surname: {type: String, require: true},
    password: {type: String, require: true},
    phoneNumber: {type: Number, require: true},
    role: {type: String, require: true},
    adress: {type: String},
    postCode: {type: Number},
    city:{type: String}
})

userSchema.plugin(uniqueValidator, {message: "Cet email est déja utilisé !"})

module.exports = mongoose.model('User', userSchema)