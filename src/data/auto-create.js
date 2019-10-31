// // !!!!CAREFUL WITH THIS NODE SCRIPT.
const fs = require('fs');
const all = require('./symbols');
const path = require('path');
const fetch = require('node-fetch');
const intervals = [
    { name: '5M', minutes: 5 },
    { name: '15M', minutes: 15 },
    // { name: '30M', minutes: 30 },
    // { name: '1H', minutes: 60 },
    // { name: '4H', minutes: 240 },
    // { name: '1D', minutes: 1440 },
    // { name: '1W', minutes: 7 * 1440 },
    // { name: '1M', minutes: 30 * 1440 }
]

// all.data.forEach(async (smb) => {
//     // if (fs.existsSync(path.resolve(`./symbols/${smb.symbol}.json`))) {
//     //     console.log('exist', smb.symbol);
//     // } else {
//     await Promise.all(intervals.map(async (interval) => {
//         const text = fs.readFileSync(path.resolve(`./symbols/${smb.symbol}.json`), "utf-8");
//         fs.writeFileSync(path.resolve(`./symbols/${smb.symbol}${interval.name}.json`), text);
//     }))

//     // }
// })
const MS_PER_MINUTE = 60000;
const rangeStart = new Date("2019-10-1 00:00:00");
const rangeEnd = new Date("2019-11-1 00:00:00");

const magic = (arg, fixed = 2) => {
    const val = Number.parseFloat(arg);
    const dir = Math.random() >= 0.5 ? 'up' : 'down';
    const coef = Number.parseFloat((Math.random() * 1).toFixed(2));

    const newVal = Number.parseFloat((val + (val * coef / 100)).toFixed(fixed));
    const dif = newVal - val;

    return dir === 'up'
        ? String((val + dif).toFixed(fixed))
        : String((val - dif).toFixed(fixed))
}

all.data.forEach(async (smb) => {
    await Promise.all(intervals.map(async (interval) => {
        if (fs.existsSync(path.resolve(`./symbols/${smb.symbol}${interval.name}.json`))) {
            const text = fs.readFileSync(path.resolve(`./symbols/${smb.symbol}.json`), "utf-8");
            if (text) {
                const obj = JSON.parse(text);
                const intra = {};
                const foo = MS_PER_MINUTE * interval.minutes;
                const keys = Object.keys(obj.intraday);
                const init = obj.intraday[keys[0]];

                for (let i = rangeStart.getTime(); i <= rangeEnd.getTime(); i += foo) {
                    const old = intra[new Date(i - foo).toISOString()] !== undefined
                        ? intra[new Date(i - foo).toISOString()]
                        : init;

                    const rnd = (Math.random() + 0.01);
                    const volatility = 0.05;
                    let cngP = 2 * volatility * rnd;
                    if (cngP > volatility) {
                        cngP -= (2 * volatility);
                    }
                    const change = Number(old.close) * cngP;
                    const newPrice = Number(old.close) + change;
                    const high = Math.max(newPrice, Number(old.close));
                    const low = Math.min(newPrice, Number(old.close));

                    intra[new Date(i).toISOString()] = {
                        open: String((Number.parseFloat(old.close) + 0.01).toFixed(2)),
                        close: String(newPrice.toFixed(2)),
                        high: String((high + (0.015 * high)).toFixed(2)),
                        low: String((low - (0.015 * low)).toFixed(2)),
                        volume: magic(old.volume, 0),
                    }
                }

                obj.intraday = intra;

                fs.writeFileSync(path.resolve(`./symbols/${smb.symbol}${interval.name}.json`), JSON.stringify(obj));
                console.log('success', smb.symbol, interval.name);
            } else {
                console.warn("WARN", smb.symbol, interval);
            }

        }
    }))
})