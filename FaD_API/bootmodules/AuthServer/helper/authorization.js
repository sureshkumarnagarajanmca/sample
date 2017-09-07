/**
 * Created by pradeep on 4/12/16.
 */
var jwt = require('jsonwebtoken');
var JWT_SECRET           ='asdfgf12345*@';
exports.authorized = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.user_data = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'Not Authorized, please login!'
        });

    }
}
