const moment = require('moment');

class Personnel {
    constructor(name, cbOnDone){
        this._name = name;
        this._cbOnDone = cbOnDone
    }
    
    get name() { return this._name; }

    async work(pizza) {
        return new Promise(resolve => {
            if(this._cbOnDone) this._cbOnDone(pizza);
            resolve();
        });        
    }

    log(pizza, station, start) {
        const end = moment(new moment(), global.config.dateTimeFormat);
        pizza.log.push({
            station,
            start,
            end: new Date(),
            totalPreperationTime: moment.utc(end.diff(start)).format("HH:mm:ss")
        });
    }
}

module.exports = Personnel;