class BaseNotification {
    constructor(id) {
        this._id = id;
    }

    sendNotification(msg) {} // abstract method 
}

module.exports = BaseNotification;