export const duration = {
    seconds(val) {
        return val;
    },
    minutes(val) {
        return val * this.seconds(60);
    },
    hours(val) {
        return val * this.minutes(60);
    },
    days(val) {
        return val * this.hours(24);
    },
    weeks(val) {
        return val * this.days(7);
    },
    years(val) {
        return val * this.days(365);
    }
};
