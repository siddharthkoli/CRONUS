const fs = require('fs');
const path = require('path');

module.exports = class Logger {
    static id = 0;

    async logToFile(filename, data) {
        fs.appendFile(path.join(__dirname, '../', '/logs/', filename), data, err => {
            if (err)
                console.log(`Error while logging to file ${filename}`);
        })
    }

    static logTermDeposit(data) {
        let content = `${id} ${Date.now()} ${data.to}\n`;
        id++;
        new Logger().logToFile('Term_Deposit.txt', content);
    }

    static logNationalSavingsCertificate(data) {
        let content = `${id} ${Date.now()} ${data.to}\n`;
        id++;
        new Logger().logToFile('National_Savings_Certificate.txt', content);
    }

    static logMonthlyIncomeScheme(data) {
        let content = `${id} ${Date.now()} ${data.to}\n`;
        id++;
        new Logger().logToFile('Monthly_Income_Scheme.txt', content);
    }

    static logNewUser(data) {
        let content = `${Date.now()} ${data.user} ${data.chatId}\n`;
        new Logger().logToFile('Telegram_Updates.txt', content);
    }

    static logMessage(data) {
        let content = `${Date.now()} ${data.update_id} ${data.user} ${data.chatId} ${data.msg}\n`;
        new Logger().logToFile('Telegram_Updates.txt', content);
    }
}