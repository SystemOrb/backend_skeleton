var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//Para inicialziar un esquema en la db
var Schema = moongose.Schema;

var setUser = new Schema({
    nombre: { type: String, required: [true, 'Please write your name'] },
    email: { type: String, unique: true, required: [true, 'Please write your email'] },
    password: { type: String, required: [true, 'Please write your password'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'ADMIN_ROLE' }
});

//Exportamos este esquema

setUser.plugin(uniqueValidator, { message: 'Error, el {PATH} ya existe.' });
module.exports = moongose.model('Usuarios', setUser);