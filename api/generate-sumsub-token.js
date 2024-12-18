const Cors = require('micro-cors');
const axios = require('axios');
const crypto = require('crypto');

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
  origin: 'https://mtc-v2.vercel.app', // Replace with your actual frontend domain
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'Missing userId in request body' });
      return;
    }

    // Retrieve SumSub credentials from environment variables
    const sumsubApiUrl = 'https://api.sumsub.com/resources/accessTokens';
    const sumsubApiKey = process.env.SUMSUB_API_KEY;    // App Token
    const sumsubApiSecret = process.env.SUMSUB_API_SECRET; // Secret Key

    if (!sumsubApiKey || !sumsubApiSecret) {
      throw new Error('SumSub API credentials are not set in environment variables.');
    }

    // Prepare the request
    const ts = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const httpMethod = 'POST';
    const urlPath = '/resources/accessTokens';

    // Build the query parameters
    const queryParamsObj = {
      levelName: 'YOUR_LEVEL_NAME', // Replace with your actual level name
      userId: userId,
    };

    // Sort the query parameters alphabetically and encode them
    const sortedQueryParams = Object.keys(queryParamsObj)
      .sort()
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(queryParamsObj[key])}`;
      })
      .join('&');

    const fullUrl = `${sumsubApiUrl}?${sortedQueryParams}`;

    // Prepare the body
    const requestBody = {}; // Empty object as per SumSub's requirement
    const bodyString = JSON.stringify(requestBody);

    // Prepare the signature string
    const signatureString = ts + httpMethod + urlPath + '?' + sortedQueryParams + bodyString;

    // Calculate HMAC signature
    const hmac = crypto.createHmac('sha256', sumsubApiSecret);
    hmac.update(signatureString);
    const signature = hmac.digest('hex');

    // Set headers
    const headers = {
      'X-App-Token': sumsubApiKey,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString(),
      'Content-Type': 'application/json',
    };

    // Make the request to SumSub
    const response = await axios.post(fullUrl, requestBody, { headers });

    const { token } = response.data;

    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error(
      'Error generating SumSub token:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = cors(handler);
