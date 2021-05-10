const BaseNotification = require("./BaseNotification");
const nodeMailer = require('nodemailer');

class EmailNotification extends BaseNotification {
    constructor(id) {
        super(id);
    }

    sendNotification(msg) {
        return;
    }
}

module.exports = EmailNotification;