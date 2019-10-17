const amqp = require('amqplib');

class Station {
    constructor(name, from, isAck = true, to, personnels){
        this._name = name;
        this._from = from;
        this._isAck = isAck;
        this._to = to;
        this._personnels = personnels;
    }
    
    get input() { return this._from; }

    async init(){
        const self = this;
        self._personnels.forEach(async personnel => {
            const connection = await amqp.connect(global.config.rabbit);
            const channel = await connection.createChannel();        
            
            await channel.assertQueue(self._from, {
                durable: false
            });
    
            channel.prefetch(1);
    
            channel.consume(self._from, async data => {
                const pizza = JSON.parse(data.content);
                await personnel.work(pizza);
                self._to && channel.sendToQueue(self._to, Buffer.from(JSON.stringify(pizza)));
                self._isAck && channel.ack(data);
            }, {
                noAck: !self._isAck
            });
        });
    }
}

module.exports = Station;