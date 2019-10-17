const fs = require('fs');
const amqp = require('amqplib');
const moment = require('moment');
const _colors = require('colors');

const Personnels = require('./personnels/Personnels');
const Station = require('./station/Station');

const progressBar = require('./progress/ProgressBar');

const initGlobalConfig = (path = 'config.json') => {
    try{
        const config = fs.readFileSync(`${__dirname}/${path}`, { encoding: 'utf8'});    
        return global.config = JSON.parse(config);    
    }
    catch(error){
        console.error(`Could not read '${path}' file.\nPlease make sure the file can be located at the root.`);
        console.error(error.message);
        process.exit(0);
    }
}

const initRabbitConnection = async url => {
    try{
        connection = await amqp.connect(url);        
        return connection;
    }catch(error){
        console.error(`Could not establish a connection to RabbitMQ.\nPlease make sure the service is up and running.`);
        console.error(error.message);
        process.exit(0);
    }
}

const getData = ordersFile => {
    try{
        const data = fs.readFileSync(`${__dirname}/${ordersFile}`, { encoding: 'utf8'});
        return JSON.parse(data);
    }catch(error){
        console.error(`Could not read orders file.\nPlease make sure the config file's 'ordersFile' property is set.`);
        console.error(error.message);
        process.exit(0);
    }    
}

const createStations = (stations, stationCb, isAck = true) => {
    const result = [];
    
    stations.forEach(station => {
        let personnels;
        switch(station.name){
            case 'Dough':
                personnels = Personnels.getDoughChefs(stationCb);
                break;
            case 'Toppings':
                personnels = Personnels.getToppingsChefs(stationCb);
                break;
            case 'Oven':
                personnels = Personnels.getOvenChefs(stationCb);
                break;
            case 'Waiter':
                personnels = Personnels.getWaiters(stationCb);
                break;
            case 'Done':
                personnels = Personnels.getDone(stationCb);
                break;
        }
        result.push(new Station(station.name, station.input, isAck, station.output, personnels));
    });
    
    return result;
}

const initStations = async stations => {
    await Promise.all(stations.map(station => station.init()));
}

const sendOrders = async (connection, orders, firstStation, onNewOrder) => {
    const channel = await connection.createChannel();
    
    channel.assertQueue(firstStation, {
        durable: false
    });
    
    orders.forEach(order => {
        const stringifyed = JSON.stringify(order);
        onNewOrder(5, 0, {id: order.id});
        channel.sendToQueue(firstStation, Buffer.from(stringifyed));
    });
    
    return moment(new moment(), global.config.dateTimeFormat);
}


const openPizzaRestaurant = async () => {

    let startTime = '';

    const {stations: stationsConfig, doneStation} = initGlobalConfig();

    const connection = await initRabbitConnection(global.config.rabbit);

    let {orders} = getData(global.config.ordersFile);

    progressBar.init();

    const stations = createStations(stationsConfig, progressBar.update);
    
    //Prepare the last summary station
    //
    const doneCb = (counter) => {
        const orders = [];        
        return pizza => {
            orders.push(pizza);
            progressBar.increment(pizza.id);
            counter--;
            if(counter <= 0){
                const endTime = moment(new moment(), global.config.dateTimeFormat);

                console.log(_colors.bgGreen(`\n\nStarted on ${startTime} <-> Ended on ${endTime}`));
                console.log(_colors.bgGreen(`Total time (HH:mm:ss) is ${moment.utc(endTime.diff(startTime)).format("HH:mm:ss")}\n`));
                
                console.log(`Summary for each order\'s preperation time\n-----------------------------------------------`);

                orders.forEach(order => {
                    console.log(`Order #${order.id} with ${order.toppings.length ? '' : 'no'} toppings ${order.toppings.join(' and ')}`);
                    console.table(order.log);
                });

                connection.close();
                process.exit(0);
            }
        }
    };

    //Complete adding the last station in chain
    //
    stations.push(createStations([doneStation], doneCb(orders.length), false)[0]);

    //Link stations
    //
    await initStations(stations);
    
    //Send orders to the first station
    //
    startTime = await sendOrders(connection, orders, stations[0].input, progressBar.addBar);
};

openPizzaRestaurant();