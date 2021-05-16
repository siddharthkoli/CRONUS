const BaseInvestmentJob = require('./BaseInvestmentJob');
const excelAPI = require('../utils/excelAPI');
const path = require('path');
const TelegramNotification = require('../notifications/TelegramNotification');
const Logger = require('../Logger/Logger');

class MonthlyIncomeScheme extends BaseInvestmentJob {
    constructor(data) {
        super(data);
    }

    static async readExcel() {
        const worksheet = await excelAPI.getWorksheet(path.join(__dirname, '../', '/ExcelFiles/jobs.xlsx'), 1);
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            const maturityDate = new Date(row.getCell(5))
            const currentDate = new Date();
            if (currentDate.getFullYear() <= maturityDate.getFullYear() && currentDate.getDate() == maturityDate.getDate()) { // change this logic properly to include dates like 31st of the month
                const data = {
                    accNo: row.getCell(2).value,
                    names: {
                        name1: row.getCell(3).value.split("|")[0],
                        name2: row.getCell(3).value.split("|")[1],
                    },
                    intDeposited: row.getCell(7).value,
                    principal: row.getCell(6).value,
                    medium: row.getCell(1).value,
                    date: `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`,
                    master: 'Vasant'
                };
                let mis = new MonthlyIncomeScheme(data);
                const masterTelegramNotification = new TelegramNotification(process.env[`${data.master.toUpperCase()}_CHAT_ID`]);
                masterTelegramNotification.sendNotification(mis.generateNotificationString());
                Logger.logMonthlyIncomeScheme({to: data.master});
                for (let user in mis._names) {
                    if (mis._names[user] == undefined) continue;
                    new TelegramNotification(process.env[`${mis._names[user].split(" ")[0].toUpperCase()}_CHAT_ID`]).sendNotification(mis.generateNotificationString());
                    Logger.logMonthlyIncomeScheme({to: mis._names[user].split(" ")[0].toUpperCase()});
                }
            }
        });

    }

    generateNotificationString() {
        return `This is to remind you that your account number ${this._accNo} should be credited with Rs. ${this._intDeposited} today (${this._date}) for the principal of Rs. ${this._principal} in ${this._medium}. This account is in the name of ${this._names.name1}${this._names.name2 == undefined ? '' : ` and ${this._names.name2}`}.\n\nSent with concern,\nCRONUS.`;
    }
}

module.exports = MonthlyIncomeScheme;