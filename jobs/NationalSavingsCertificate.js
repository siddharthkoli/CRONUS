const path = require('path');
const excelAPI = require('../utils/excelAPI');
const TelegramNotification = require("../notifications/TelegramNotification");
const BaseInvestmentJob = require("./BaseInvestmentJob");
const EmailNotification = require('../notifications/EmailNotification');
const Logger = require('../Logger/Logger');

class NationalSavingsCertificate extends BaseInvestmentJob {
    constructor(data) {
        super(data);
    }

    static async readExcel() {
        const worksheet = await excelAPI.getWorksheet(path.join(__dirname, '../', '/ExcelFiles/jobs.xlsx'), 2);
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            const currentDate = new Date();
            const maturityDate = new Date(row.getCell(5).value);
            if (currentDate.getFullYear() == maturityDate.getFullYear() && currentDate.getMonth() == maturityDate.getMonth() && currentDate.getDate() == maturityDate.getDate()) {
                const data = {
                    accNo: row.getCell(2).value,
                    names: row.getCell(3).value,
                    intDeposited: row.getCell(7).value,
                    principal: row.getCell(6).value,
                    medium: row.getCell(1).value,
                    date: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                    master: 'Vasant'
                }
                let nsc = new NationalSavingsCertificate(data);
                const masterTelegramNotification = new TelegramNotification(process.env[`${data.master.toUpperCase()}_CHAT_ID`]);
                masterTelegramNotification.sendNotification(nsc.generateNotificationString());
                Logger.logNationalSavingsCertificate({to: data.master});
                const telegramNotification = new TelegramNotification(process.env[`${nsc._names.toUpperCase()}_CHAT_ID`]);
                telegramNotification.sendNotification(nsc.generateNotificationString());
                Logger.logNationalSavingsCertificate({to: nsc._names.toUpperCase()});                
                const emailNotification = new EmailNotification(row.getCell(9).value);
                emailNotification.sendNotification(nsc.generateNotificationString());
            }
        });
    }

    generateNotificationString() {
        return `This is to remind you that your account number ${this._accNo} should be credited with Rs. ${this._intDeposited} today (${this._date}) for the principal of Rs. ${this._principal} in ${this._medium}. This account is in the name of ${this._names} for National Savings Certificate.\n\nSent with concern,\nCRONUS.`;
    }
}

module.exports = NationalSavingsCertificate;