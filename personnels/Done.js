const Personnel = require('./Personnel');

class Done extends Personnel {
    constructor(name, cb){
        super(name, cb);
    }

    async work(pizza) {
        const self = this;        
        return new Promise(resolve => {
            const start = pizza.log[0].start

            self.log(pizza, 'total', start);

            self._cbOnDone(pizza);
            resolve();
        });
    }
}

module.exports = Done;