const Personnel = require('./Personnel');

class Oven extends Personnel{
    constructor(name, cb){
        super(name, cb);        
    }
    
    async work(pizza) {
        const self = this;
        return new Promise(resolve => {
            if(self._cbOnDone) self._cbOnDone({id: pizza.id, station:'oven'});                
            const start = new Date();
            setTimeout(() => {
                self.log(pizza, 'oven', start);
                resolve();
            }, 10000);
        });
    }
}

module.exports = Oven;