var express = require('express');
var app = express();
var medicalSchema = require('../models/medicos');
var signature = require('../config/config').apikey;
const token = require('../middlewares/tokenizer');
app.get('/', (request, response, next) => {
    medicalSchema.find({}, 'nombre img usuario hospital').exec(
        (err, medicals) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    message: 'Error al cargar los datos en la base de datos',
                    callback: err
                });
            }
            response.status(200).json({
                status: true,
                message: 'Petición realizada con éxito',
                medicos: medicals
            });
        }
    );
});
// GET MEDICO BY ID
app.get('/:id', (request, response, next) => {
    const id = request.params.id;
    medicalSchema.findById(id).populate('usuarios').exec(
        (err, medico) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    message: 'Fallo al conectar con la base de datos',
                    err
                });
            }
            if (!medico) {
                return response.status(400).json({
                    status: false,
                    message: 'No existe este medico con esta ID'
                });
            }
            response.status(200).json({
                status: true,
                message: 'Medico cargado con éxito',
                medico
            });
        }
    );
});
// INSERT NEW MEDICO
app.post('/:id/:hospital', token.tokenGenerator, (request, response, next) => {
    const usr_id = request.params.id;
    const hospital_id = request.params.hospital;
    const header = request.body;
    const medicoData = new medicalSchema({
        nombre: header.nombre,
        img: header.img,
        usuario: usr_id,
        hospital: hospital_id
    });
    medicoData.save((err, newMedico) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Error al cargar los datos en la base de datos',
                callback: err
            });
        }
        response.status(200).json({
            status: true,
            message: 'Medico creado con éxito',
            medicos: newMedico
        });
    });
});
// PUT A DOCTOR 
app.put('/:doctor', token.tokenGenerator, (request, response, next) => {
    const doctor = request.params.doctor;
    const header = request.body;
    medicalSchema.findById(doctor).populate('hospital').exec((err, doctorUpdate) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'No se ha podido conectar con la base de datos',
                error: err
            });
        }
        if (!doctorUpdate) {
            return response.status(400).json({
                status: false,
                message: 'No existe este doctor',
                error: err
            });
        }
        doctorUpdate.nombre = header.nombre;
        doctorUpdate.hospital = header.hospital;
        doctorUpdate.img = header.img;
        doctorUpdate.save((err, doctor) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    message: 'No se ha podido conectar con la base de datos',
                    error: err
                });
            }
            response.status(200).json({
                status: true,
                message: 'Medico actualizado con éxito',
                doctor
            });
        });
    });
});
// DELETE A DOCTOR
app.delete('/:doctor', token.tokenGenerator, (request, response, next) => {
    const doctor = request.params.doctor;
    const header = request.body;
    medicalSchema.findByIdAndRemove(doctor, (err, removed) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'No se ha podido conectar con la base de datos',
                error: err
            });
        }
        if (!removed) {
            return response.status(400).json({
                status: false,
                message: 'No existe este doctor en la base de datos',
                error: err
            });
        }
        response.status(200).json({
            status: true,
            message: 'Medico borrado con éxito',
            removed
        });
    });
});
module.exports = app;