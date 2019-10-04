
function async(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    }
}

module.exports = async;

// SaoNM đây là một cách để handle errors
// hiện tại đang dùng express-async-errors