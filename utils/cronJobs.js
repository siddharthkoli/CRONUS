const cron = require('node-cron');
const TermDeposit = require('../jobs/TermDeposit');
const TelegramNotification = require('../notifications/TelegramNotification');

const executeCRONJobs = () => {
    TermDepositCRON();
}

const TermDepositCRON = () => {
    cron.schedule('0 8 * * *', async () => {
        await TermDeposit.readExcel().catch(err => console.log(`[cronJobs.js|TermDepositCRON] ${err}`));
    });
}

const getTelegramUpdate = () => {
    cron.schedule('*/1 * * * *', () => {
        TelegramNotification.getUpdates();
    });
}

module.exports = {
    executeCRONJobs,
    getTelegramUpdate
};