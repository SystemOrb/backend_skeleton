var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var users = require('../models/usuario');
var jwt = require('jsonwebtoken');
var signature = require('../config/config').apikey;
app.post('/', (request, response) => {
    const headers = request.body;
    users.findOne({
        email: headers.email
    }, (err, userDB) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Ha fallado al conexión con la base de datos',
                callback: err
            });
        }
        if (!userDB) {
            return response.status(400).json({
                status: false,
                message: 'Tu correo electrónico o contraseña son incorrectos'
            });
        }
        if (bcrypt.compareSync(headers.password, userDB.password)) {
            const token = jwt.sign({ userData: userDB }, signature, { expiresIn: 14400 });
            response.status(201).json({
                status: true,
                message: 'Usuario logeado con éxito',
                key: userDB,
                sessionAuth: token
            });
        } else {
            return response.status(400).json({
                status: false,
                message: 'Tu correo electrónico o contraseña son incorrectos'
            });
        }
    });
});



module.exports = app;