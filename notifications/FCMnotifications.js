require('dotenv').config();
var FCM = require('fcm-node');
var serverKey = process.env.FCM_SERVER_KEY;
var fcm = new FCM(serverKey);
const Devices = require('../models/devices');

const removedAppointmentPushNotification = async (fcmToken, serviceName) => {
    var message = {
        to: fcmToken,
		notification: {
			title: `Appointment Status at ${serviceName}`,
			body: `Your appointment at ${serviceName} has been cancelled and removed from the Queue since you failed to show up.`
		}
    };

    fcm.send(message, function (err, response) {
		if (err) {
			console.log(`[removedAppointmentPushNotification] ${err}`);
		}
	})
}

module.exports = {
    removedAppointmentPushNotification
};