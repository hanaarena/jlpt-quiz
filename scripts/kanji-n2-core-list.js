const fs = require('fs');
const path = require('path');
const data = require('../app/data/n2_kanji-list.json');

function main() {
  const res = { kanjilist: { kanji: [], level: "n2" } }
  const list = data.kanjilist.kanji;
  list.forEach(l => {
    if (l.frequency >= 1000) {
      res.kanjilist.kanji.push(l);
    } 
  })
  fs.writeFileSync(path.resolve(__dirname, '../app/data/n2-kanji-core-list.json'), JSON.stringify(res, null, 2));
}

main();
