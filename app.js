var express = require('express');
var app = express(); // expressJS API REST 
var mongoose = require('mongoose'); // bbdd 
var bodyParser = require('body-parser')
    // Routes Import
var indexRoute = require('./routes/app');
var usersRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicosRoute = require('./routes/medicos');
var searchRoute = require('./routes/search');
var uploadRoute = require('./routes/upload');
var imagesRoute = require('./routes/images');
// Connect to mongo
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('La base de datos ha sido conectada');
});
// Routes
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/Usuarios', usersRoute);
app.use('/Auth', loginRoute);
app.use('/Hospital', hospitalRoute);
app.use('/Medicos', medicosRoute);
app.use('/search', searchRoute);
app.use('/upload', uploadRoute);
app.use('/imgs', imagesRoute);
app.use('/', indexRoute);

app.listen(3000, () => {
    console.log('Express ejecutado en el puerto 3000');
});