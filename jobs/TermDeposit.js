const excelAPI = require('../utils/excelAPI');
const EmailNotification = require('../notifications/EmailNotification');
const TelegramNotification = require('../notifications/TelegramNotification');
const BaseInvestmentJob = require('./BaseInvestmentJob');
const path = require('path');

class TermDeposit extends BaseInvestmentJob {
    constructor(data) {
        super(data);
    }

    static async readExcel() {
        const worksheet = await excelAPI.getWorksheet(path.join(__dirname, '../', '/ExcelFiles/jobs.xlsx'), 0);
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            const currentDate = new Date();
            let maturityDate = row.getCell(5);
            maturityDate = new Date(maturityDate);
            if (currentDate.getFullYear() <= maturityDate.getFullYear() && currentDate.getMonth() == maturityDate.getMonth() && currentDate.getDate() == maturityDate.getDate()) {
                const data = {
                    accNo: row.getCell(2).value,
                    names: {
                        name1: row.getCell(3).value.split("|")[0],
                        name2: row.getCell(3).value.split("|")[1],
                    },
                    intDeposited: row.getCell(7).value,
                    principal: row.getCell(6).value,
                    medium: row.getCell(1).value,
                    date: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                    master: 'Vasant'
                };
                let td = new TermDeposit(data);
                const masterTelegramNotification = new TelegramNotification(process.env[`${data.master.toUpperCase()}_CHAT_ID`]);
                masterTelegramNotification.sendNotification(td.generateNotificationString());
                for (let user in td._names) {
                    if (td._names[user] == undefined) continue;
                    const telegramNotification = new TelegramNotification(process.env[`${td._names[user].split(" ")[0].toUpperCase()}_CHAT_ID`]);
                    telegramNotification.sendNotification(td.generateNotificationString());
                }
                const emailNotification = new EmailNotification(row.getCell(9).value);
                emailNotification.sendNotification(td.generateNotificationString());
            }
        });
    }

    static async getReminders(name) {
        const worksheet = await excelAPI.getWorksheet(path.join(__dirname, '../', '/ExcelFiles/jobs.xlsx'), 0);
        let tdMsgStr = `Your Term Deposits –\n`;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            let names = [];
            names = row.getCell(3).value.split('|');
            names.forEach((value, i) => {
                if (value.split(' ')[0] == name) {
                    tdMsgStr += `${i + 1}.
                    Acc No: ${row.getCell(2).value}
                    Maturity Date: ${row.getCell(4).value}
                    Principal: ${row.getCell(5).value}
                    Interest: ${row.getCell(6).value}
                    ${row.getCell(10).value == undefined || row.getCell(10).value == null || row.getCell(10).value == '' ? null : `Nominee: ${row.getCell(10).value}`}\n`;
                }
            });
        });
        return tdMsgStr;
    }

    generateNotificationString() {
        return `This is to remind you that your account number ${this._accNo} should be credited with Rs. ${this._intDeposited} today (${this._date}) for the principal of Rs. ${this._principal} in ${this._medium}. This account is in the name of ${this._names.name1}${this._names.name2 == undefined ? '' : ` and ${this._names.name2}`}.\n\nSent with concern,\nCRONUS.`;
    }
}

module.exports = TermDeposit