var express = require('express');
var app = express();
var users = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var signature = require('../config/config').apikey;
const token = require('../middlewares/tokenizer');
//GET USER FROM MONGO
app.get('/', (request, response, next) => {
    var offset = Number(request.query.offset || 0); // Pagination
    users.find({}, 'nombre email  img role GOOGLE')
        .skip(offset).limit(5).exec(
            (err, usuarios) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'Error al cargar los datos en la base de datos',
                        callback: err
                    });
                }
                users.count({}, (err, flag) => {
                    response.status(200).json({
                        status: true,
                        message: 'Petición realizada con éxito',
                        usuarios,
                        flag
                    });
                })
            }
        );
});

// POST NEW USER
app.post('/', (request, response) => {
    var body = request.body;
    var userData = new users({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(10)),
        img: body.img,
        role: body.role
    });
    userData.save((err, userRegistered) => {
        if (err) {
            return response.status(401).json({
                status: false,
                message: 'Error al cargar los datos en la base de datos',
                callback: err
            });
        }
        response.status(201).json({
            status: true,
            message: 'Usuario registrado con éxito',
            uData: userRegistered,
            token: request.user
        });
    });
});
// UPDATE USER 
app.put('/:id', token.tokenGenerator, (request, response) => {
    var body = request.body;
    var id = request.params.id;
    users.findById(id, (err, userExists) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Error al cargar los datos en la base de datos',
                callback: err
            });
        }
        if (!userExists) {
            return response.status(401).json({
                status: false,
                message: 'El usuario con el ID: ' + id + ' no existe'
            });
        }
        userExists.nombre = body.nombre;
        userExists.email = body.email;
        userExists.role = body.role;
        userExists.save((err, userUpdated) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    message: 'Error al actualizar los datos en la base de datos',
                    callback: err
                });
            }
            body.password = undefined;
            response.status(201).json({
                status: true,
                message: 'Usuario actualizado con éxito',
                uData: userUpdated
            });
        });
    });
});

//DELETE USER
app.delete('/:id', token.tokenGenerator, (request, response) => {
    const id = request.params.id;
    users.findByIdAndRemove(id, (err, userExists) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Error al generar esta petición a la base de datos',
                callback: err
            });
        }
        if (!userExists) {
            return response.status(400).json({
                status: false,
                message: 'No existe este usuario en la base de datos'
            });
        }
        response.status(201).json({
            status: true,
            message: 'Usuario borrado con éxito',
            uData: userExists
        });
    });
});

module.exports = app;