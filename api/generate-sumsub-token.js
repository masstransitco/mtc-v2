const crypto = require('crypto');
const axios = require('axios');

// Environment variables
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY; // Secret Key
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;   // App Token
const SUMSUB_LEVEL_NAME = process.env.SUMSUB_LEVEL_NAME; // Level Name

module.exports = async (req, res) => {
    const allowedOrigin = 'https://www.masstransit.company';

    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log(`Request Method: ${req.method}`);
    console.log(`Request Origin: ${req.headers.origin}`);

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('Handling preflight OPTIONS request');
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        console.log('Method not allowed');
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Ensure the request has a JSON body
        const { userId } = req.body;

        if (!userId) {
            console.log('Missing userId in request body');
            res.status(400).json({ error: 'Missing userId in request body' });
            return;
        }

        const payload = {
            userId,
            ttlInSecs: 600,         // Token valid for 10 minutes
            levelName: SUMSUB_LEVEL_NAME, // Include the levelName
        };

        // Generate the HMAC signature for the request
        const signature = crypto
            .createHmac('sha256', SUMSUB_SECRET_KEY)
            .update(JSON.stringify(payload))
            .digest('hex');

        // API request options
        const options = {
            method: 'POST',
            url: 'https://api.sumsub.com/resources/accessTokens',
            headers: {
                'Content-Type': 'application/json',
                'X-App-Token': SUMSUB_APP_TOKEN,
                'X-App-Access-Signature': signature,
            },
            data: payload,
        };

        console.log('Making request to SumSub API');
        // Make the request to SumSub API
        const response = await axios(options);

        console.log('Received response from SumSub API');
        // Respond with the generated token
        res.status(200).json({ token: response.data.token });
    } catch (error) {
        console.error('Error generating SumSub token:', error);

        // Ensure CORS headers are still set in error responses
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        res.status(500).json({ error: 'Failed to generate token' });
    }
};