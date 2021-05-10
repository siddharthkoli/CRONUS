const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        default: null,
        required: true,
    },
    fcmToken: {
        type: String,
        required: true,
    }

})
module.exports = mongoose.model('devices', deviceSchema, 'Devices')