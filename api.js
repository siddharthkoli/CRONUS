require('dotenv');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Devices = require('./models/devices');

// const db = process.env.DEV_DB_CONNECTION_STRING;
const db = 'mongodb+srv://userprajakta:pwprajakta@cluster0-zkstr.mongodb.net/Services?retryWrites=true&w=majority';

// mongoose.connect(
// 	db,
// 	{ useNewUrlParser: true, useUnifiedTopology: true },
// 	err => {
// 		if (err) {
// 			console.error('Error' + err)
// 		} else {
// 			console.log('Connect to Mongo Db')
// 		}
// 	}
// )

// // Add to DB
// router.post("/addFCMToken", async (req, res) => {
// 	await Devices.findOne({ userName: req.body.userName }, (err, doc) => {
// 		if (err) return res.status(500).send(err)
// 		if (!doc) {
// 			// console.log(`Here111`);
// 			var newdoc = new Devices({ userName: req.body.userName, fcmToken: req.body.fcmToken });
// 			newdoc.save().catch(err => console.log(err))
// 			// return res.status(200).send('Easy')
// 		} else {
// 			Devices.findOneAndUpdate({ userName: req.body.userName }, { $set: { fcmToken: req.body.fcmToken } }, {
// 				new: true
// 			}).catch(err => console.log(err))
// 		}
// 	}).catch(err => console.log(err));
// 	res.status(200).send({ message: 'Easy' })
// })

// // Remove from DB
// router.post('/deleteFCMToken', async (req, res) => {
// 	await Devices.findOneAndDelete({ userName: req.body.userName }).catch(err => console.log(`error while deleting token ${err}`));
// 	res.status(200).send({ message: "Easy" });
// })



module.exports = router;