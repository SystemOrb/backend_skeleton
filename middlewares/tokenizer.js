var jwt = require('jsonwebtoken');
var signature = require('../config/config').apikey;
module.exports.tokenGenerator = function(request, response, next) {
    const token = request.query.token;
    jwt.verify(token, signature, (err, auth) => {
        if (err) {
            return response.status(401).json({
                status: false,
                message: 'Tu token ha vencido',
                callback: err
            });
        }
        request.user = auth.user;
        next();
    });
}
module.exports.ROLE = function(request, response, next) {
    var id = request.params.id;
    var user = request.body;
    if (user.role === 'ADMIN_ROLE' || user._id === id) {
        next();
    } else {
        return response.status(401).json({
            status: false,
            message: 'No tienes permiso para hacer eso'
        });
    }
}