// !!!!CAREFUL WITH THIS NODE SCRIPT.
// const fs = require('fs');
// const all = require('./symbols');
// const path = require('path');
// const fetch = require('node-fetch');

// all.data.forEach(async (smb) => {
//     if (fs.existsSync(path.resolve(`./symbols/${smb.symbol}.json`))) {
//         console.log('exist', smb.symbol);
//     } else {
//         const url = `https://intraday.worldtradingdata.com/api/v1/intraday?symbol=${smb.symbol}&range=1&interval=1&api_token=8GUiD3dflLRoUIplZbOlGznYPPGETjUrv03uNyPjdnXOgoRoRyYoLoaAT0b1`
//         const resp = await fetch(url);
//         const result = await resp.json();
//         fs.writeFileSync(path.resolve(`./symbols/${smb.symbol}.json`), JSON.stringify(result));
//     }
// })