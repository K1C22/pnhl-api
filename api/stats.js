const axios = require('axios');

module.exports = async (req, res) => {
    // Configuration des accès (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const type = req.query.type || 'skaters';
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        
        // On renvoie les données à ton site
        res.status(200).json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: "Erreur de connexion à la NHL" });
    }
};
