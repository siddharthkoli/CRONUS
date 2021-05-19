const BaseJob = require("./BaseJob");

module.exports = class BaseDayCounterJob extends BaseJob {
    constructor(data) {
        super();
        this._startDate = data.startDate;
        this._endDate = data.endDate;
        this._differenceInDays = 0;
    }

    calculateDayDifference() {
        const differenceInTime = this._endDate.getTime() - this._startDate.getTime();
        this._differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    }
}