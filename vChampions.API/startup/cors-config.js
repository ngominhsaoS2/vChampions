const cors = require('cors');

module.exports = function (app) {
    app.use(cors(
        {
            "origin": ["http://localhost:4200", "http://vietchampions.com", "https://vietchampions.com"], 
        }
    ));
}
