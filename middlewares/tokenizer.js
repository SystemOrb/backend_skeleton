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