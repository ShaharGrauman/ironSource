const Personnel = require('./Personnel');

class Waiter extends Personnel{
    constructor(name, cb){
        super(name, cb);
    }
    
    async work(pizza) {
        const self = this;
        return new Promise(resolve => {
            if(self._cbOnDone) self._cbOnDone({id: pizza.id, station:'waiter'});                
            const start = new Date();
            setTimeout(() => {
                self.log(pizza, 'waiter', start);
                resolve();
            }, 5000);
        });
    }
}

module.exports = Waiter;