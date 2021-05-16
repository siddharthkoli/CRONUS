require('dotenv').config();
const https = require('https');
const BaseNotification = require('./BaseNotification');
const users = require('./telegramConfig');
const fs = require('fs');
const path = require('path');
const TermDeposit = require('../jobs/TermDeposit');
const Logger = require('../Logger/Logger');

class TelegramNotification extends BaseNotification {
    constructor(id) {
        super(id);
    }

    static host = `api.telegram.org`;
    static path = `/bot${process.env.PROD_TELEGRAM_BOT_API_KEY}`

    static checkAndAddNewUsers(data) {
        data.result.forEach((user) => {
            if (!users.includes(user.message.from.first_name)) {
                users.push(user.message.from.first_name);
                fs.writeFileSync(
                    __dirname + '/telegramConfig.js',
                    `let users = ${JSON.stringify(users)};\nmodule.exports=users;`
                );
                fs.appendFileSync(
                    path.join(__dirname, '../', `production.env`),
                    `\n${user.message.from.first_name.toUpperCase()}_CHAT_ID=${user.message.chat.id}`
                );
                const tn = new TelegramNotification(user.message.chat.id);
                tn.sendNotification(tn.generateWelcomeMessage());
                console.log(`New User added: ${user.message.from.first_name}`);
                Logger.logNewUser({ user: user.message.from.first_name, chatId: user.message.chat.id });
            }
        })
    }

    static analyzeCommands(data) {
        data.forEach((update) => {
            if (!update.message.text) continue;
            if (!update.message.entities && update.message.text) {
                if (update.message.text == 'test') {
                    console.log(`Working`);
                    new TelegramNotification(update.message.from.id).sendNotification('Working');
                }
                Logger.logMessage({ updateId: update.update_id, user: update.message.chat.first_name, chatId: update.message.chat.id, msg: update.message.text });
                continue;
            }
            switch (update.message.text) {
                // all commands will come here.
                case '/my_reminders':
                    const tn = new TelegramNotification(update.message.chat.id);
                    tn.executeMyReminders();
                    Logger.logMessage({ user: update.message.chat.first_name, chatId: update.message.chat.id, msg: update.message.text });
                    break;
            };
        });
    }

    static getUpdates() {
        var getReq = https.request({
            host: TelegramNotification.host,
            path: TelegramNotification.path + '/getUpdates',
            method: 'GET'
        }, function (res) {
            res.on('data', function (data) {
                data = JSON.parse(data);
                if (!data.result) return;
                console.log(`${data}`);
                TelegramNotification.checkAndAddNewUsers(data);
                TelegramNotification.analyzeCommands(data.result);
            });
        });
        getReq.end();
        getReq.on('error', function (err) {
            console.log(`error ${err}`);
        });
    }

    sendNotification(msg) {
        const data = JSON.stringify({
            chat_id: this._id,
            text: msg
        });
        let req = https.request({
            host: TelegramNotification.host,
            path: TelegramNotification.path + '/sendMessage',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, function (res) {
            console.log(`status ${res.statusCode}`);
            res.on('data', d => {
                console.log(`data ${d}`);
            });
        });

        req.on('error', err => {
            console.log(`[TelegramNotification.js] ${err}`);
        })

        req.write(data);
        req.end();
    }

    generateWelcomeMessage() {
        return `Hey! Thanks for pinging me!\nI'm Cronus, as in the Greek God of Time. I'll make sure that you'll get your notifications for your reminders on time.\n Be seeing you! \\m/`;
    }

    executeMyReminders() {
        let allRemindersString = null;
        allRemindersString += TermDeposit.getReminders();
        // new reminders will go here.
        this.sendNotification(allRemindersString);
    }
}

module.exports = TelegramNotification;