
const _ = require('lodash');

function admin(req, res, next) {
    try {
        if (_.includes(req.user.roles, 'Admin') == true || _.includes(req.user.roles, 'Moderator') == true) {
            req.isAdminOrModerator = true;
        } else {
            req.isAdminOrModerator = false;
        }
        
        next();
    }
    catch (ex) {
        req.isAdminOrModerator = false;
        next();
    }
}

module.exports = admin;