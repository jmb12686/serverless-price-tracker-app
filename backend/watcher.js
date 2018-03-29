'use strict';
const AWS = require('aws-sdk');
const WATCHED_ITEMS_TABLE = process.env.WATCHED_ITEMS_TABLE; // This is the variable we setup in the serverless.yml.  Lambda env vars are in process.env
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.run = (event, context, callback) => {
  //TODO:
  //1st - query dynamo WATCHED_ITEMS_TABLE
  //2nd - for each, fire off request to get latest price + update latest price + send notification if < threshold
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
        console.log("TODO: Get latest price for item: "+JSON.stringify(item));
        console.log("TODO: IF latest price < threshold, send notification!");
      });
      console.log("Done scanning, returning now...");
      callback(null, "Success");
    }
  }
}
