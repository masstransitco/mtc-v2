const axios = require('axios');
const crypto = require('crypto');

// SumSub credentials
const sumsubApiKey = process.env.SUMSUB_API_KEY; // App Token
const sumsubApiSecret = process.env.SUMSUB_API_SECRET; // Secret Key

// Request details
const ts = Math.floor(Date.now() / 1000); // Current Unix timestamp
const httpMethod = 'GET';
const urlPath = '/resources/your-endpoint'; // Replace with the actual endpoint
const queryParamsObj = {
  param1: 'value1',
  param2: 'value2',
};

// Sort and encode query parameters
const sortedQueryParams = Object.keys(queryParamsObj)
  .sort()
  .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParamsObj[key])}`)
  .join('&');

// Build the signature string
const signatureString = ts + httpMethod + urlPath + '?' + sortedQueryParams;

// Generate HMAC signature
const hmac = crypto.createHmac('sha256', sumsubApiSecret);
hmac.update(signatureString);
const signature = hmac.digest('hex');

// Prepare headers
const headers = {
  'X-App-Token': sumsubApiKey,
  'X-App-Access-Sig': signature,
  'X-App-Access-Ts': ts.toString(),
  'Accept': 'application/json',
};

// Full URL
const fullUrl = `https://api.sumsub.com${urlPath}?${sortedQueryParams}`;

// Make the GET request
axios.get(fullUrl, { headers })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
