const ApiHelper = {
    /**
     * Generate API Response JSON using parameters provided
     *
     * @param {Object} res Response Object
     * @param {Object} req Request Object
     * @param {string} msg Message|Error or Message or Error. (general message, success message or error message. If want to send both message & error, use pipe separated string.). Default is empty string.
     * @param {number} code HTTP Status Code. Default is 400.
     * @param {string[]} data Response Payload. Default is empty array.
     *
     * @returns {string} API Response in JSON format
     */
    generateApiResponse: (res, req, msg = "", code = 400, result = []) => {
        var message = "";
        var error = "";
        var requestToken = null;

        if (msg == "" || msg.split("|").length <= 1) {
            message = msg;
            error = msg;
        } else {
            let messages = msg.split("|");
            message = messages[0];
            error = messages[1];
        }

        if (code == 200 || code == 201) {
            error = "";
        }
        return res.status(code).send({
            requestToken,
            message,
            error,
            result,
        });
    },
};

module.exports = ApiHelper;