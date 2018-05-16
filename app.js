'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const population = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let prefectureMap = map.get(prefecture);
        if (!prefectureMap) {
            // 人口情報を定義
            prefectureMap = {
                population10: 0,
                population15: 0,
                change: null,
            };
        }
        if (year === 2010) {
            prefectureMap.population10 += population;
        }
        if (year === 2015) {
            prefectureMap.population15 += population;
        }
        map.set(prefecture, prefectureMap);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.population15 / value.population10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].population10 + '=>' + pair[1].population15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
