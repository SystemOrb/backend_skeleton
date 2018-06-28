var express = require('express');
var hospitals = require('../models/hospital');
var doctors = require('../models/medicos');
var usuarios = require('../models/usuario');
var app = express(); // expressJS API REST 



/*
Colección individual 
*/
app.get('/collection/:db_collection/:query', (request, response, next) => {
    const query = request.params.query;
    const collection = request.params.db_collection;
    switch (collection) {
        case 'Hospital':
            searchHospitals(new RegExp(query, 'i')).then((resolve) => {
                response.status(200).json({
                    status: true,
                    message: 'Busqueda de datos exitoso',
                    resolve
                });
            }).catch((reject) => {
                return response.status(500).json({
                    status: false,
                    message: 'Fallo al obtener la data de busqueda',
                    reject
                });
            });
            break;
        case 'Medicos':
            searchDoctors(new RegExp(query, 'i')).then((resolve) => {
                response.status(200).json({
                    status: true,
                    message: 'Busqueda de datos exitoso',
                    resolve
                });
            }).catch((reject) => {
                return response.status(500).json({
                    status: false,
                    message: 'Fallo al obtener la data de busqueda',
                    reject
                });
            });
            break;
        case 'usuarios':
            searchUsers(new RegExp(query, 'i')).then((resolve) => {
                response.status(200).json({
                    status: true,
                    message: 'Busqueda de datos exitoso',
                    resolve
                });
            }).catch((reject) => {
                return response.status(500).json({
                    status: false,
                    message: 'Fallo al obtener la data de busqueda',
                    reject
                });
            });
            break;
    }
});
/*
Colección general es decir todos las tablas de la bbdd
*/
app.get('/all/:query', (request, response, next) => {
    const query = request.params.query;
    Promise.all([
        searchHospitals(new RegExp(query, 'i')),
        searchDoctors(new RegExp(query, 'i')),
        searchUsers(new RegExp(query, 'i'))
    ]).then((dataResponse) => {
        response.status(200).json({
            status: true,
            message: 'Datos cargados con éxito',
            Hospitales: dataResponse[0],
            Doctores: dataResponse[1],
            Usuarios: dataResponse[2]
        });
    }).catch((dataError) => {
        response.status(500).json({
            status: false,
            message: 'Hemos presentado un error, inténtalo más tarde',
            dataError
        });
    });
});
// PROMESAS QUE RETORNARÁN LAS QUERYS DE FORMA ASINCRÓNA
function searchHospitals(regex) {
    return new Promise((resolve, reject) => {
        hospitals.find({ nombre: regex }).populate('usuarios', 'nombre email img').exec((err, hospitales) => {
            if (err) {
                reject('No se han podido cargar los hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function searchDoctors(regex) {
    return new Promise((resolve, reject) => {
        doctors.find({ nombre: regex }).populate('usuarios', 'nombre email img').exec((err, doctores) => {
            if (err) {
                reject('No se han podido cargar la lista de doctores');
            } else {
                resolve(doctores);
            }
        });
    });
}
// Para buscar doble parametro dentro de una base de datos
function searchUsers(regex) {
    return new Promise((resolve, reject) => {
        usuarios.find({}, 'nombre email img').or([
            { 'nombre': regex },
            { 'email': regex }
        ]).exec((err, users) => {
            if (err) {
                reject('No se han podido cargar la lista de usuarios');
            } else {
                resolve(users);
            }
        });
    });
}
module.exports = app;