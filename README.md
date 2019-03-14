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
