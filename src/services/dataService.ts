import symbols from '../data/symbols.json';
import SNAP from '../data/symbols/SNAP.json';

const processData = (data: any) => {
    const result = Object.keys(data.intraday).reduce((acc: any[], current: string) => {
        const other = data.intraday[current];

        return [...acc, {
            "open": Number.parseFloat(other.open),
            "close": Number.parseFloat(other.close),
            "high": Number.parseFloat(other.high),
            "low": Number.parseFloat(other.low),
            "volume": Number.parseFloat(other.volume),
            "date": `\/Date(${new Date(current).getTime()})\/`
        }]
    }, [])

    return result;
}

export const dataService = {
    getAllSymbols: async () => {
        // let response = await fetch("https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=API_KEY")
        // let result = await response.json();
        // return result;
        return symbols.data;
    },
    getSymbol: (symbol: any) => {
        return processData(SNAP)
    }
}