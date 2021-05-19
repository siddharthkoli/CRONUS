const Logger = require("../Logger/Logger");
const TelegramNotification = require("../notifications/TelegramNotification");
const BaseDayCounterJob = require("./BaseDayCounterJob");

module.exports = class InternshipEndDays extends BaseDayCounterJob {
    constructor(data) {
        super(data);
    }

    static async executeJob() {
        const data = {
            startDate: new Date(),
            endDate: new Date("09/15/2021")
        };
        let ied = new InternshipEndDays(data);
        ied.calculateDayDifference();
        if (ied._differenceInDays <= 0) return; 
        new TelegramNotification(process.env['SIDDHARTH_CHAT_ID']).sendNotification(ied.generateNotificationString());
        Logger.logDayCounter('Internship_Counter', 'Siddharth');
    }

    generateNotificationString() {
        if (this._differenceInDays == 1) {
            return `Only 1 day is remaining for your internship to end!\n\nSent with concern,\nCRONUS.`;
        } else {
            return `You have ${this._differenceInDays} days remaining for your internship to end. You can do this!\n\nSent with concern,\nCRONUS.`;
        }
    }
}