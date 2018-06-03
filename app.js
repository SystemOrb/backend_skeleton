var express = require('express');
var app = express(); // expressJS API REST 
var mongoose = require('mongoose'); // bbdd 
app.get('/', (request, response, next) => {
    response.status(200).json({
        status: true,
        message: 'Petición realizada con éxito'
    });
});

// Connect to mongo
mongoose.connection.openUri('mongodb://localhost:27017/curso_HopistalDB', (err, resp) => {
    if (err) throw err;
    console.log('La base de datos ha sido conectada');
});

/*app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});*/
app.listen(3000, () => {
    console.log('Express ejecutado en el puerto 3000');
});