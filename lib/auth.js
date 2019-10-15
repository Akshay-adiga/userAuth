const jwt = require('jsonwebtoken');
const exceptions = [
    '/api/v1/auth/login',
    '/api/v1/auth/signup'
]
module.exports = function (req, res, next) {
    if(exceptions.indexOf(req.originalUrl.split('?')[0]) > -1){
        next();
        return;
    }
    const token = req.body.token || req.params.token || req.headers['access-token'];
    if (token) {
        jwt.verify(token, 'testPasww221', function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'failed to authenticate token.'
                });
            } else {
                if (!decoded) {
                    return res.status(401).send({
                        success: false,
                        message: 'failed to authenticate token.'
                    });
                }
                req.user = decoded
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'no token provided.'
        });
    }
}