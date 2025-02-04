const fs = require("fs");
const path = require("path");
const readline = require('readline');

const fileList = ["kanji_n1", "kanji_n2", "kanji_n3"];

async function main() {
  for await (const filename of fileList) {
    const csvPath = path.resolve(__dirname, "../app/data/kanjiV2/", `${filename}.csv`);
    const level = filename.match(/\d/)[0];
    const fileStream = fs.createReadStream(csvPath, { encoding: "utf-8" });
    // [[`kanji`, `kana`, `meaning`, `tag`, `guid`]]
    let dataset = [];
    const data = { name: `JLPT N${level} kanji list`, list: [] };

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      // examples:
      // [kanji, kana, meaning, tag, guid]
      // 推定,すいてい,"presumption, assumption, estimation",JLPT JLPT_2,jp6vOFS{a6
      // 水滴,すいてき,drop of water,JLPT JLPT_2,y}Hrc9&%7j
      dataset.push(line.split(/(".*?"|[^",\n]+)/g))
    }
    // remove empty & ","
    dataset = dataset.map(innerArray => innerArray.filter(a => a !== "" && a !== ","));
    // delete title array
    dataset.splice(0, 1);

    dataset.forEach(arr => {
      const [kanji, kana, meaning] = arr;
      data.list.push({
        kanji,
        kana,
        meaning: meaning.replace(/\"/g, "")
      })
    })
    fs.writeFileSync(path.resolve(__dirname, `../app/data/kanjiV2/n${level}-kanji-v2-list.json`), JSON.stringify(data, null, 2));
  }
}

main();
