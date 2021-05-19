const BaseDayCounterJob = require("./BaseDayCounterJob");
const TelegramNotification = require("../notifications/TelegramNotification");
const Logger = require("../Logger/Logger");

module.exports = class TietoEndDayCounter extends BaseDayCounterJob {
    constructor(data) {
        super(data);
    }

    static async executeJob() {
        const data = {
            startDate: new Date(),
            endDate: new Date("07/12/2021")
        };
        let ted = new TietoEndDayCounter(data);
        ted.calculateDayDifference();
        if (ted._differenceInDays <= 0) return; 
        new TelegramNotification(process.env['PRAJAKTA_CHAT_ID']).sendNotification(ted.generateNotificationString());
        Logger.logDayCounter('Tieto_End_Day_Counter', 'Prajakta');
    }

    generateNotificationString() {
        if (this._differenceInDays == 1) {
            return `Only 1 day to go!\n\nSent with concern,\nCRONUS.`;
        } else {
            return `You have only ${this._differenceInDays} days left. You can do this!\n\nSent with concern,\nCRONUS.`;
        }
    }
}