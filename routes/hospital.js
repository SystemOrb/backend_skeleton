var express = require('express');
var hospitalSchema = require('../models/hospital');
var signature = require('../config/config').apikey;
const token = require('../middlewares/tokenizer');
var app = express();
app.get('/', (request, response, next) => {
    hospitalSchema.find({})
        .populate('usuarios').exec(
            (err, hospitals) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'No hemos podido conectar con la base de datos',
                        error: err
                    });
                }
                response.status(200).json({
                    status: true,
                    message: 'Hospitales cargado con éxito',
                    hospitals: hospitals
                });
            }
        );
});
// post new hospital
app.post('/:id', token.tokenGenerator, (request, response, next) => {
    var header = request.body;
    const id = request.params.id;
    var hospitalData = new hospitalSchema({
        nombre: header.nombre,
        img: header.img,
        usuario: id
    });
    hospitalData.save((err, newHospital) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'Fallo al crear este hospital',
                error: err
            });
        }
        response.status(200).json({
            status: true,
            message: 'Hospital agregado con éxito',
            data: header,
            hospital: newHospital
        });
    });
});
// UPDATE HOSPITAL 
app.put('/:hospital_id', token.tokenGenerator, (request, response, next) => {
    const h_id = request.params.hospital_id;
    const header = request.body;
    hospitalSchema.findById(h_id, (err, hospital) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'No se ha podido conectar con la base de datos',
                error: err
            });
        }
        if (!hospital) {
            return response.status(400).json({
                status: false,
                message: 'Este hospital no existe'
            });
        }
        hospital.nombre = header.nombre;
        hospital.img = header.img;
        hospital.save((err, hospitalUpdated) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    message: 'No se ha podido actualizar la base de datos',
                    error: err
                });
            }
            response.status(201).json({
                status: true,
                message: 'Hospital actualizado con éxito',
                hospital: hospitalUpdated
            });
        });
    });
});
// DELETE HOSPITAL
app.delete('/:hospital_id', token.tokenGenerator, (request, response, next) => {
    const id = request.params.hospital_id;
    hospitalSchema.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Error al generar esta petición a la base de datos',
                callback: err
            });
        }
        if (!hospital) {
            return response.status(400).json({
                status: false,
                message: 'No existe este hospital en la base de datos'
            });
        }
        response.status(201).json({
            status: true,
            message: 'Hospital borrado con éxito',
            hospital
        });
    });
});

module.exports = app;