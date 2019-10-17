const Personnel = require('./Personnel');

class DoughChef extends Personnel{
    constructor(name, cb){
        super(name, cb);
    }

    async work(pizza) {
        const self = this;
        return new Promise(resolve => {
            if(self._cbOnDone) self._cbOnDone({id: pizza.id, station:'dough'});                
            const start = new Date();
            
            setTimeout(() => {
                self.log(pizza, 'dough', start);
                resolve();
            }, 7000);
        });
    }
}

module.exports = DoughChef;