const cc = require('cryptocompare');
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://minhtrih:minhtrih@cluster0-5rhqc.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
const fs = require('fs');
global.fetch = require('node-fetch');

cc.setApiKey('a85b367131bfc387dfeafc046cd071ff353f26a8b6f164b6ef6ce1424ff8f434');

MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db('coin_market');
  dbo
    .collection('histoDay_list')
    .find()
    .toArray(function(err, result) {
      if (err) throw err;
      let data = JSON.stringify(result);
      fs.writeFileSync('histoDay_list.json', data);
      db.close();
    });
});

async function fetchCoin() {
  let coinList = (await cc.coinList()).Data;
  let sortCoins = Object.values(coinList).sort((a, b) => (+a.SortOrder > +b.SortOrder ? 1 : -1));
  let arrCoins = [];
  for (let i in sortCoins) {
    arrCoins.push(sortCoins[i].Symbol);
  }
  return arrCoins;
}

async function fetchPrices(coinList) {
  let pricesData = await cc.priceFull(coinList, ['USD', 'BTC', 'ETH']);
  return Object.keys(pricesData).map(key => ({
    key,
    ...pricesData[key]
  }));
}

async function fetchHistorical(coin) {
  const historicalData = await cc.histoDay(coin, 'USD');
  return { coin, historicalData };
}

// client.connect(err => {
//   let jsonCoinList = [];
//   const db = client.db('coin_market');
//   db.collection('coin_list')
//     .find()
//     .toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//     });

// const sortCoins = await fetchCoin();
// for (let i = 0; i < sortCoins.length; i++) {
//   const query = { Symbol: sortCoins[i] };
//   const coinData = await db
//     .collection('coin_list')
//     .find(query)
//     .toArray();
//   jsonCoinList.push(coinData[0]);
// }

// let data = JSON.stringify(jsonCoinList);
// fs.writeFileSync('coin_list.json', data);

// crawl PriceFull
// for (let i = 0; i < sortCoins.length; i = i + 100) {
//   const pricesData = await fetchPrices(sortCoins.slice(i, i + 100));
//   try {
//     await db.collection('priceFull_list').insertMany(pricesData);
//   } catch (e) {
//     console.log(e);
//   }
// }

// crawl histoDay
// for (let i = 0; i < sortCoins.length; i++) {
//   const historicalData = await fetchHistorical(sortCoins[i]);
//   try {
//     await db.collection('histoDay_list').insertOne(historicalData);
//   } catch (e) {
//     console.log(e);
//   }
// }

//   client.close();
// });
