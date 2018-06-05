var express = require('express');
const fileUpload = require('express-fileupload');
var app = express(); // expressJS API REST 
const Hospital = require('../models/hospital');
const usuarios = require('../models/usuario');
const Medicos = require('../models/medicos');
const fs = require('fs');
// Set middleware
app.use(fileUpload());

app.put('/:collection/:id', (request, response, next) => {
    if (!request.files) {
        return response.status(400).json({
            status: false,
            message: 'Debes cargar una imagen'
        });
    }
    //Verificamos si es el tipo de archivo valido, imagen o el que se la nexe
    const file = request.files.image; // PARAMETER IN POSTMAN
    const verifyFile = file.name.split('.');
    const fileExtension = verifyFile[verifyFile.length - 1];
    const extensions = ['jpg', 'png', 'jpeg', 'gif'];
    if (extensions.indexOf(fileExtension) < 0) {
        return response.status(400).json({
            status: false,
            message: 'Las extensiones que intentas añadir son incorrectas',
            error: { 'error': 'Formato valido ' + extensions.join(', ') }
        });
    }
    // Verificamos la coleccion de la base de datos 
    const collection = request.params.collection;
    const id = request.params.id;
    const collection_valid = ['Hospital', 'Medicos', 'usuarios'];
    if (collection_valid.indexOf(collection) < 0) {
        return response.status(400).json({
            status: false,
            message: 'Debes hacer la busqueda de la base de datos correcta',
            error: { 'error': 'Colecciones disponibles ' + collection_valid.join(', ') }
        });
    }
    // Si pasa estos bloques de validación entonces ahora renombramos el archivo por seguridad
    const filename = id + '-' + new Date().getMilliseconds() + '.' + fileExtension;
    const path = './uploads/' + collection + '/' + filename;
    // AHORA MOVEMOS LA IMAGEN A LA CARPETA UPLOADS DEL SERVER
    file.mv(path, (err) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Fallo al cargar la imagen en el servidor',
                err
            });
        }
    });
    // AHORA ASIGNAMOS LA IMAGEN AL PERFIL DE USUARIO
    asignUser(collection, response, id, filename);
});

function asignUser(collection, response, id, filename) {
    switch (collection) {
        case 'usuarios':
            usuarios.findById(id, (err, usuario) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'Fallo al cargar los datos de usuario',
                        err
                    });
                }
                //Borramos la imagen que tenia anteriormente para evitar carga masiva
                const last_path = './uploads/' + collection + '/' + usuario.img;
                if (fs.existsSync(last_path)) {
                    fs.unlink(last_path);
                }
                // Sobreescribimos la antigua imagen por la nueva
                usuario.img = filename;
                usuario.save((err, userImageUpdated) => {
                    if (err) {
                        return response.status(500).json({
                            status: false,
                            message: 'Fallo al cargar los datos de usuario',
                            err
                        });
                    }
                    response.status(200).json({
                        status: true,
                        message: 'Perfil Actualizado',
                        usuario
                    });
                });
            });
            break;
        case 'Medicos':
            usuarios.findById(id, (err, usuario) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'Fallo al cargar los datos de usuario',
                        err
                    });
                }
                //Borramos la imagen que tenia anteriormente para evitar carga masiva
                const last_path = './uploads/' + collection + '/' + usuario.img;
                if (fs.existsSync(last_path)) {
                    fs.unlink(last_path);
                }
                // Sobreescribimos la antigua imagen por la nueva
                usuario.img = filename;
                usuario.save((err, userImageUpdated) => {
                    if (err) {
                        return response.status(500).json({
                            status: false,
                            message: 'Fallo al cargar los datos de usuario',
                            err
                        });
                    }
                    response.status(200).json({
                        status: true,
                        message: 'Perfil Actualizado',
                        usuario
                    });
                });
            });
            break;
        case 'Hospital':
            usuarios.findById(id, (err, usuario) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'Fallo al cargar los datos de usuario',
                        err
                    });
                }
                //Borramos la imagen que tenia anteriormente para evitar carga masiva
                const last_path = './uploads/' + collection + '/' + usuario.img;
                if (fs.existsSync(last_path)) {
                    fs.unlink(last_path);
                }
                // Sobreescribimos la antigua imagen por la nueva
                usuario.img = filename;
                usuario.save((err, userImageUpdated) => {
                    if (err) {
                        return response.status(500).json({
                            status: false,
                            message: 'Fallo al cargar los datos de usuario',
                            err
                        });
                    }
                    response.status(200).json({
                        status: true,
                        message: 'Perfil Actualizado',
                        usuario
                    });
                });
            });
            break;
    }
}
module.exports = app;
/*
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'))*/