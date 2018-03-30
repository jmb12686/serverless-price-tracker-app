'use strict';
const AWS = require("aws-sdk");
const parse = AWS.DynamoDB.Converter.output;

module.exports.handle = (event, context, callback) => {

  event.Records.forEach((record) => {
    console.log(`Received eventID: ${record.eventID}, eventName: ${record.eventName}` )
    var dynamoRecord = parse({ "M": record.dynamodb.NewImage });
    console.log("DynamoDB Record: ", JSON.stringify(dynamoRecord, null, 2));
    if (record.eventName == 'MODIFY') {
      //watched item was modified.  latest price was updated, or notification threshold was changed!
      if(dynamoRecord.latestDetails.latestPrice <= dynamoRecord.priceThreshold) {
        console.log("latestPrice for item is less than or equal to priceThreshold ")
        //TODO Send Notification!!
      }
    }

    // console.log('RStream record: ', JSON.stringify(record, null, 2));

    // if (record.eventName == 'INSERT') {
    //   var who = JSON.stringify(record.dynamodb.NewImage.Username.S);
    //   var when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S);
    //   var what = JSON.stringify(record.dynamodb.NewImage.Message.S);
    //   var params = {
    //     Subject: 'A new bark from ' + who,
    //     Message: 'Woofer user ' + who + ' barked the following at ' + when + ':\n\n ' + what,
    //     TopicArn: 'arn:aws:sns:region:accountID:wooferTopic'
    //   };
    //   sns.publish(params, function(err, data) {
    //     if (err) {
    //       console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //       console.log("Results from sending message: ", JSON.stringify(data, null, 2));
    //     }
    //   });
    // }
  });
  callback(null, `Successfully processed ${event.Records.length} records.`);

};
