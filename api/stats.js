const axios = require('axios');

module.exports = async (req, res) => {
    // Autorise ton index.html à lire les données
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const type = req.query.type || 'skaters';
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        res.status(200).json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: "NHL non disponible" });
    }
};
