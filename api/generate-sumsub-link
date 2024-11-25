const Cors = require('micro-cors');
const axios = require('axios');
const crypto = require('crypto');

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
  origin: 'https://www.yourdomain.com', // Replace with your actual frontend domain
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

    // SumSub credentials from environment variables
    const sumsubApiKey = process.env.SUMSUB_API_KEY;    // App Token
    const sumsubApiSecret = process.env.SUMSUB_API_SECRET; // Secret Key

    if (!sumsubApiKey || !sumsubApiSecret) {
      throw new Error('SumSub API credentials are not set in environment variables.');
    }

    // Prepare the request
    const ts = Math.floor(Date.now() / 1000);
    const httpMethod = 'POST';
    const urlPath = '/resources/sdkIntegrations';

    const requestBody = {
      externalUserId: userId,
      levelName: 'MTC FTU', // Replace with your actual level name
      ttlInSecs: 600, // Optional: Time-to-live for the link in seconds
    };
    const bodyString = JSON.stringify(requestBody);

    // Generate the signature
    const signatureString = ts + httpMethod + urlPath + bodyString;
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
    const response = await axios.post(
      'https://api.sumsub.com' + urlPath,
      requestBody,
      { headers }
    );

    const { link } = response.data;

    res.status(200).json({ link });
  } catch (error) {
    console.error(
      'Error generating SumSub external link:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = cors(handler);
