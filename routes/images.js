/*
Esto devuelve la imagen al front 
*/
var express = require('express');
const fs = require('fs');
const path = require('path');
var app = express(); // expressJS API REST 
app.get('/:collection/:img', (request, response, next) => {
    const collection = request.params.collection;
    const img = request.params.img;
    // Construimos y buscamos la ruta del path
    var route = '../uploads/' + collection + '/' + img;
    const actualPath = path.resolve(__dirname, route);
    // Verifiacamos si existe
    if (fs.existsSync(actualPath)) {
        response.sendFile(actualPath);
    } else {
        // Mandamos una imagen por defecto
        var asset_route = '../assets/img/no-img.jpg';
        const default_path = path.resolve(__dirname, asset_route);
        response.sendFile(default_path);
    }
});

module.exports = app;