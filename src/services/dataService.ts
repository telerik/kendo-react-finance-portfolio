import symbols from '../data/symbols.json';
import AAPL from '../data/symbols/AAPL.json';
import ACN from '../data/symbols/ACN.json';
import ADBE from '../data/symbols/ADBE.json';
import ASML from '../data/symbols/ASML.json';
import AVGO from '../data/symbols/AVGO.json';
import CRM from '../data/symbols/CRM.json';
import CSCO from '../data/symbols/CSCO.json';
import FB from '../data/symbols/FB.json';
import GOOGL from '../data/symbols/GOOGL.json';
import IBM from '../data/symbols/IBM.json';
import INTC from '../data/symbols/INTC.json';
import MSFT from '../data/symbols/MSFT.json';
import NVDA from '../data/symbols/NVDA.json';
import ORCL from '../data/symbols/ORCL.json';
import QCOM from '../data/symbols/QCOM.json';
import SAP from '../data/symbols/SAP.json';
import SNAP from '../data/symbols/SNAP.json';
import SNE from '../data/symbols/SNE.json';
import TSM from '../data/symbols/TSM.json';
import TWTR from '../data/symbols/TWTR.json';
import TXN from '../data/symbols/TXN.json';
import VODL from '../data/symbols/VOD.L.json';

const symbolsMap: any = {
    SNAP,
    AAPL,
    ACN,
    ADBE,
    ASML,
    AVGO,
    CRM,
    CSCO,
    FB,
    GOOGL,
    IBM,
    INTC,
    MSFT,
    NVDA,
    ORCL,
    QCOM,
    SAP,
    SNE,
    TSM,
    TWTR,
    TXN,
    VODL
}

const processData = (data: any) => {
    const result = Object.keys(data.intraday).reduce((acc: any[], current: string) => {
        const other = data.intraday[current];

        return [...acc, {
            "open": Number.parseFloat(other.open),
            "close": Number.parseFloat(other.close),
            "high": Number.parseFloat(other.high),
            "low": Number.parseFloat(other.low),
            "volume": Number.parseFloat(other.volume),
            "date": `/Date(${new Date(current).getTime()})/`
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
        return processData(symbolsMap[symbol])
    }
}