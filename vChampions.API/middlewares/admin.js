
function admin(req, res, next) {
    try {
        if (req.user.role.name != 'Admin') return res.status(403).send('Access denied. Required Admin permission'); // Forbidden
        next();
    }
    catch (ex) {
        res.status(401).send('Access denied. Required Admin permission.');
    }
}

module.exports = admin;