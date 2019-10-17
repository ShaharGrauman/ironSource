const DoughChef = require('./DoughChef');
const ToppingsChef = require('./ToppingsChef');
const Oven = require('./Oven');
const Waiter = require('./Waiter');
const Done = require('./Done');

module.exports = {
    getDoughChefs: cb => [new DoughChef('Shahar', cb), new DoughChef('Amit', cb)],
    getToppingsChefs: cb => [new ToppingsChef('Gandalf', cb), 
                             new ToppingsChef('Frodo', cb),
                             new ToppingsChef('Pippin', cb)],
    getOvenChefs: cb => [new Oven('Sauron', cb)],
    getWaiters: cb => [new Waiter('Samuel', cb),
                              new Waiter('Gollum', cb)],
    getDone: cb => [new Done('done', cb)]
};
