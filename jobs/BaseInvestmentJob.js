const BaseJob = require('./BaseJob');

class BaseInvestmentJob extends BaseJob {
    constructor(data) {
        super(data);
        this._accNo = data.accNo;
        // this._names = {
        //     name1: data.name1,
        //     name2: data.name2
        // };
        this._names = data.names;
        this._intDeposited = data.intDeposited;
        this._principal = data.principal;
        this._medium = data.medium || undefined;
        this._date = data.date;
        this._nomminee = data.nominee || undefined;
        this._master = data.master;
    }

    generateNotificationString() {} // abstract method
}

module.exports = BaseInvestmentJob;