var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var users = require('../models/usuario');
var jwt = require('jsonwebtoken');
var signature = require('../config/config').apikey;


/**************************************************
 * Login con Google
 **************************************************/
const { OAuth2Client } = require('google-auth-library');
const googleKey = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(googleKey);
// Función para verificar el Token del cliente GOOGLE DOCUMENTATION
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleKey, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// Hacemos la petición post
app.post('/Google', async(request, response, next) => {
    // Body parser
    const TOKEN = request.body.token; //Capturamos el token pasado
    // Necesitamos leer la promesa 
    var GoogleSign = await verify(TOKEN).catch((err) => {
        return response.status(401).json({
            status: false,
            message: 'Token inválido',
            err
        });
    });
    //HACEMOS LA BUSQUEDA DEL USUARIO EN LA BBDD 
    // SI NO EXISTE LO REGISTRA, SI EXISTE LO AUTENTICA
    users.findOne({ email: GoogleSign.email }, (err, UsuarioGoogle) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: 'Ha fallado al conexión con la base de datos',
                callback: err
            });
        }
        //VERIFICAMOS SI EXISTE
        if (UsuarioGoogle) {
            if (!UsuarioGoogle.GOOGLE) {
                return response.status(400).json({
                    status: false,
                    message: 'Este usuario no existe'
                });
            } else {
                // Existe entonces generamos un token de la app
                const token = jwt.sign({ userData: UsuarioGoogle }, signature, { expiresIn: 14400 });
                response.status(201).json({
                    status: true,
                    message: 'Usuario logeado con éxito',
                    key: UsuarioGoogle,
                    sessionAuth: token,
                    menu: menuRole(UsuarioGoogle.role)
                });
            }
        } else {
            // NO EXISTE ENTONCES CREAMOS UN USUARIO NUEVO
            var usuario = new users({
                nombre: GoogleSign.nombre,
                email: GoogleSign.email,
                password: ':)_;1_1qaz2sx2030',
                img: GoogleSign.picture,
                GOOGLE: true
            });
            usuario.save((err, newUser) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        message: 'Ha fallado al conexión con la base de datos',
                        callback: err
                    });
                }
                const token = jwt.sign({ userData: newUser }, signature, { expiresIn: 14400 });
                response.status(201).json({
                    status: true,
                    message: 'Usuario logeado con éxito',
                    key: newUser,
                    sessionAuth: token,
                    menu: menuRole(newUser.role)
                });
            });
        }
    });
});

/*==========================================
    Login normal
/*========================================= */

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
                sessionAuth: token,
                menu: menuRole(userDB.role)
            });
        } else {
            return response.status(400).json({
                status: false,
                message: 'Tu correo electrónico o contraseña son incorrectos'
            });
        }
    });
});

function menuRole(role) {
    var menu = [{
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Barra de progreso', route: '/progress' },
                { title: 'Temas', route: '/themes' },
                { title: 'Gráficas', route: '/charts' },
                { title: 'Promesas', route: '/promises' },
                { title: 'rxjs', route: '/rxjs' },
                { title: 'Perfil', route: '/profile' },
            ]
        },
        {
            title: 'Administración',
            icon: 'mdi mdi-account-settings-variant',
            submenu: [
                /*{title: 'Usuarios', route: '/usuarios'},
                {title: 'Hospitales', route: '/Hospital'},
                {title: 'Medicos', route: '/Medicos'},*/
            ]
        }
    ];
    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Usuarios', route: '/usuarios' }, { title: 'Hospitales', route: '/Hospital' }, { title: 'Medicos', route: '/Medicos' });
    }
    return menu;
}


module.exports = app;