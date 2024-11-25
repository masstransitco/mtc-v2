const Cors = require('micro-cors');
const axios = require('axios');

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
  origin: 'https://www.masstransit.company', // Replace with your actual frontend domain
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
    const sumsubApiKey = process.env.SUMSUB_API_KEY;
    const sumsubApiSecret = process.env.SUMSUB_API_SECRET;

    if (!sumsubApiKey || !sumsubApiSecret) {
      throw new Error('SumSub API credentials are not set in environment variables.');
    }

    const response = await axios.post(sumsubApiUrl, {
      userId,
      levelName: 'mtc', // Replace with your desired level
    }, {
      auth: {
        username: sumsubApiKey,
        password: sumsubApiSecret,
      },
    });

    const { accessToken } = response.data;
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error generating SumSub token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = cors(handler);
