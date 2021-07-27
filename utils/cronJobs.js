const cron = require('node-cron');
const InternshipEndDays = require('../jobs/InternshipEndDays');
const MonthlyIncomeScheme = require('../jobs/MonthlyIncomeScheme');
const NationalSavingsCertificate = require('../jobs/NationalSavingsCertificate');
const TermDeposit = require('../jobs/TermDeposit');
const TietoEndDayCounter = require('../jobs/TietoEndDayCounter');
const TelegramNotification = require('../notifications/TelegramNotification');

const executeCRONJobs = () => {
    TermDepositCRON();
    MonthlyIncomeSchemeCRON();
    NationalSavingsCertificateCRON();
    InternshipEndDaysCRON();
    TietoEndDayCounterCRON();
}

const TermDepositCRON = () => {
    cron.schedule('0 8 * * *', async () => {
        await TermDeposit.readExcel().catch(err => console.log(`[cronJobs.js|TermDepositCRON] ${err}`));
    });
}

const MonthlyIncomeSchemeCRON = () => {
    cron.schedule('0 8 * * *', async () => {
        await MonthlyIncomeScheme.readExcel().catch(err => console.log(`[cronJobs.js|MonthlyIncomeSchemeCRON] ${err}`));
    });
}

const NationalSavingsCertificateCRON = () => {
    cron.schedule('0 8 * * *', async () => {
        await NationalSavingsCertificate.readExcel().catch(err => console.log(`[cronJobs.js|NationalSavingsCertificateCRON] ${err}`));
    });
}

const InternshipEndDaysCRON = () => {
    cron.schedule('0 9 * * *', async () => {
        await InternshipEndDays.executeJob().catch(err => console.log(`[cronJobs.js|InternshipEndDaysCRON] ${err}`));
    });
}

const TietoEndDayCounterCRON = () => {
    cron.schedule('0 9 * * *', async () => {
        await TietoEndDayCounter.executeJob().catch(err => console.log(`[cronJobs.js|TietoEndDayCounterCRON] ${err}`));
    });
}

const getTelegramUpdate = () => {
    cron.schedule('0 */1 * * *', () => {
        TelegramNotification.getUpdates();
    });
}

module.exports = {
    executeCRONJobs,
    getTelegramUpdate
};