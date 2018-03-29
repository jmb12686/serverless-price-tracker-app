'use strict';
// const async = require("async");
const AWS = require('aws-sdk');
const scraper = require("./scraper");
const WATCHED_ITEMS_TABLE = process.env.WATCHED_ITEMS_TABLE; // This is the variable we setup in the serverless.yml.  Lambda env vars are in process.env
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.run = (event, context, callback) => {

  console.log("***** Executing watcher job.  Scanning Dynamo table.....");
  var params = {
    TableName: WATCHED_ITEMS_TABLE,
  };
  dynamoDb.scan(params, onScan);

  function onScan(err, data) {
    if(err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded.");
      data.Items.forEach(function(item) {
        console.log("Getting latest price for item: "+JSON.stringify(item));
        scraper.getPrice(item.url, function(price) {
            console.log("latest price for item @ url "+ item.url+ " : "+price);
            var latestDetails = {
              latestPrice: price,
              timestamp: new Date().toISOString(),
            };
            // Update record in DynamoDB
            var updateParams = {
              TableName: WATCHED_ITEMS_TABLE,
              Key: {
                url: item.url
              },
              UpdateExpression: "set latestDetails = :latestDetails",
                ExpressionAttributeValues:{
                        ":latestDetails":latestDetails
                    },
                ReturnValues:"UPDATED_NEW"
            };
            dynamoDb.update(updateParams, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });

        });
        //item.latestDetails[latestPrice]=x;
        //item.latestDetails[timestamp]=y;


      });
      console.log("Done scanning, returning now...");
      callback(null, "Success");
    }
  }
}
