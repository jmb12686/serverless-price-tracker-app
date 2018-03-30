const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const scraper = require("./scraper");

const WATCHED_ITEMS_TABLE = process.env.WATCHED_ITEMS_TABLE; // This is the variable we setup in the serverless.yml.  Lambda env vars are in process.env
const dynamoDb = new AWS.DynamoDB.DocumentClient();


app.use(bodyParser.json({ strict: false }));

app.get('/api/v1/price/:productUrl', function(req, res) {
  console.log('***** getting price for item @ URL: '+req.params.productUrl);
  const uri = req.params.productUrl;
  scraper.getPrice(uri, function(price) {
      res.json({price});
  });
});

  app.get('/api/v1/productDetails/:productUrl', function(req, res) {
    console.log('***** getting productDetails for item @ URL: '+req.params.productUrl);
    const uri = req.params.productUrl;
    scraper.getDetails(uri, function(itemDetails) {
        res.json({itemDetails});
    });
});

app.post('/api/v1/watch', function (req, res) {
  const{url, priceThreshold, notificationPhoneNumber} = req.body;
  console.log('****** getting productDetails and watching item @ URL: '+url);
  scraper.getDetails(url, function(itemDetails) {
    console.log("scraped details.....");
    console.log(itemDetails);

    //TODO Throw error if priceThreshold <= itemDetails.price

    const params = {
      TableName: WATCHED_ITEMS_TABLE,
        Item: {
          url: url,
          name: itemDetails.name,
          category: itemDetails.category,
          initialPrice: itemDetails.price,
          priceThreshold: priceThreshold,
          notificationPhoneNumber: notificationPhoneNumber,
        },
    };
    dynamoDb.put(params, (error) => {
      if (error) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(error, null, 2));
        res.status(400).json({ error: 'Could not item in watch table' });
      }
      res.json({ status: 'successfully watching item',  });
    });

  });
});

app.post('/api/v1/unwatch', function (req, res) {
  const url = req.body;
  console.log("******* Unwatching product @ URL: "+url);
  const params = {
    TableName: WATCHED_ITEMS_TABLE,
    Key:{
      "url": url,
    },
  };

  dynamoDb.delete(params, (error) => {
    if(error) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(error, null, 2));
      res.status(400).json({ error: 'Could not unwatch item'});
    }
    res.json({ status: 'successfully unwatched item'});
  });

});

module.exports.handler = serverless(app);
