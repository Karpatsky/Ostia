/* WELCOME TO THE OSTIA TRADING PLATFORM */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var async = require('async');
var moment = require('moment');
var bodyParser = require('body-parser');

// Passsing in a sample config
var config = {
  liveTrading: true,
  backtestMode: false,
  strategyName: "simple-arbitrage", // exponential moving average
  exchanges: "all", // exchanges strategy will trade
  pair: "BTCUSD", // or "none" for every pair
  capital: 3000, // starting capital
  timeFrame: 4, // how long to trade
  interval: 1000,
  API_KEYS: {
    poloniex: "123XYZ",
    gdax: "123ABC"
  }
}


// Set up Trading desk and run strategy
//var runLiveTrading = require("./lib/TradingDesk.js");
//runLiveTrading(config);

io.sockets.on('connection', function (socket) {
  async.waterfall([

    /* Initialze data */
    function (callback) {
      var financialData = require('./lib/strategies/basicStrategy.js');
      var candlestickData = financialData.candlestickData;
      var indicators = financialData.indicators;
      var flags = financialData.flags;
      var backtest = financialData.backtest;
      var benchmark = financialData.benchmark;
      callback(null, candlestickData, indicators, financialData, flags, backtest, benchmark);
    },

    /* emit initialized data */
    function (candlestickData, indicators, financialData, flags, backtest, benchmark, callback) {
      socket.emit('initializedChartData', {
        candlestickData: candlestickData,
        indicators: indicators,
        flags: flags,
        backtest: backtest
      });
      socket.emit('chartFlags', {
        flags: null
      });
      socket.emit('backtest', {
        backtest: backtest,
        benchmark: benchmark
      });
      callback(null, financialData);
    },

    /* poll for live data and emit */
    function (financialData, callback) {
      // var counter = 0;
      // var eventLooper = setInterval(function () {
      //   var mostRecentTickerPrice = financialData.updatedFinanceData;
      //   socket.emit('updatedChartData', {
      //     time: new Date().getTime(),
      //     mostRecentTickerPrice: parseFloat(mostRecentTickerPrice)
      //   });
      //   console.log("### SERVER: " + Date.now() + ": live data point sent")
      // }, 5000);
    }

  ], function (err, result) {
    // result now equals 'done'
  });
});

//************************/
//        ROUTES
//* ***********************/

app.use(express.static('client'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/1', function (req, res) {
  res.sendfile(path.join(__dirname, '/client/html/index.html'))
})

app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, '/client/pages/index.html'))
})

app.get('/test', function (req, res) {
  res.sendfile(path.join(__dirname, '/client/html/chartTest.html'))
})

app.post('/post_sandbox', function(req, res, next){
  console.log(req.body.sandbox);
  res.send("GREAT SUCCESS");

})

// Creating Express server
server.listen(3000)
