const Personnel = require('./Personnel');

class ToppingsChef extends Personnel{
    constructor(name, cb){
        super(name, cb);
    }
    
    async work(pizza) {
        const self = this;
        return new Promise(resolve => {
            if(self._cbOnDone) self._cbOnDone({id: pizza.id, station:'toppings'});                
            const start = new Date();
            setTimeout(() => {
                self.log(pizza, 'toppings', start);
                resolve();
            }, 4000 * Math.ceil(pizza.toppings.length / 2));
        });
    }
}

module.exports = ToppingsChef;