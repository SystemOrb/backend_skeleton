var express = require('express');
var app = express(); // expressJS API REST 
app.get('/', (request, response, next) => {
    response.status(200).json({
        status: true,
        message: 'Petición realizada con éxito'
    });
});

module.exports = app;