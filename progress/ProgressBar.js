const _cliProgress = require('cli-progress');
const _colors = require('colors');


const progress = {
    multiBar: null,
    bars: {}
};

const update = ({id, station}) => progress.bars[id].increment(1, {id, station});

const increment = id => progress.bars[id].increment();

const addBar = (total, start, payload) => progress.bars[payload.id] = progress.multiBar.create(total, start, {id: payload.id});

const init = () => {
    progress.multiBar = new _cliProgress.MultiBar({
        hideCursor: true,
        format: (options, params, payload) => { 
            const bar = options.barCompleteString.substr(0, Math.round(params.progress*options.barsize));         
            if (params.value >= params.total){
                return `Order #${_colors.green(payload.id)} ${_colors.green(params.value + '/' + params.total)} [${bar}] `;
            }else{
                return `Order #${_colors.yellow(payload.id)} ${_colors.yellow(params.value + '/' + params.total)} [${bar}] ${payload.station || ''}`;
            }    
        }
    }, _cliProgress.Presets.shades_classic);
}

module.exports = {
    init,
    addBar,
    increment,
    update
};
