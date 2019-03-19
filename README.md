# serverless-price-tracker-app
Serverless app for tracking price of amazon.com items.  Select items in the React.js UI to register for price tracking in the backend (AWS Lambda + DynamoDB).  When the price drops to the requested $ amount, a notification function (AWS Lambda) sends an email via AWS SNS.

## Instructions

### Clone Repo
```bash 
git clone https://github.com/jmb12686/serverless-price-tracker-app.git
cd serverless-price-tracker-app/backend/
```

### Install dependencies
```bash
npm install
```

### Deploy with serverless framework
```bash
serverless deploy --aws-profile <AWS_CREDENTIAL_PROFILE_NAME>
```

### Usage
Obtain the **ServiceEndpoint** url from the cloudformation stack output.  This is the entry point to API Gateway for our app deployment and will be the root base URL for our API.  

#### Get Price
`$ROOT_BASE_URL/api/v1/price/$PRODUCT_URL` - Get price for item.  Example Usage:

`https://XXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/api/v1/price/https%3A%2F%2Fwww.walmart.com%2Fip%2FParent-s-Choice-HMO-NonGMO-Sensitivity-Infant-Formula-4-Pack-33-2oz-ea%2F407822086`

* `$ROOT_BASE_URL` - ServiceEndpoint / API Gateway endpoint
* `$PRODUCT_URL` - URL of product to scrape price from.  Must be URL encoded.

#### Get Product Details
`$ROOT_BASE_URL/api/v1/productDetails/$PRODUCT_URL` - Get details for item.  Example Usage:

`https://XXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/api/v1/productDetails/https%3A%2F%2Fwww.walmart.com%2Fip%2FParent-s-Choice-HMO-NonGMO-Sensitivity-Infant-Formula-4-Pack-33-2oz-ea%2F407822086`

* `$ROOT_BASE_URL` - ServiceEndpoint / API Gateway endpoint
* `$PRODUCT_URL` - URL of product to scrape details from.  Must be URL encoded.

#### Watch item for price drop notifications
`$ROOT_BASE_URL/api/v1/watch` - Watch item for price drop.  Expects `url` `priceThreshold` and `notificationPhoneNumber` as POST JSON input data:
* JSON input example: `{"url":"https://www.walmart.com/ip/Parent-s-Choice-HMO-NonGMO-Sensitivity-Infant-Formula-4-Pack-33-2oz-ea/407822086", "priceThreshold":PRICE, "notificationPhoneNumber":"5555555555"}`

Full curl usage example: 
```bash
curl -d '{"url":"https://www.walmart.com/ip/Parent-s-Choice-HMO-NonGMO-Sensitivity-Infant-Formula-4-Pack-33-2oz-ea/407822086", "priceThreshold":74, "notificationPhoneNumber":"5555555555"}' -H "Content-Type: application/json" -X POST https://XXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/api/v1/watch
```
