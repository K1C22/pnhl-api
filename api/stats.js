const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const type = req.query.type || 'skaters';
    
    // NOUVELLES URLS : Celles-ci sont les plus stables en 2026
    // Skaters: https://api-web.nhle.com/v1/skater-stats-now/en
    // Goalies: https://api-web.nhle.com/v1/goalie-stats-now/en
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
        
        // La NHL renvoie un objet avec une clé "data". On l'envoie à ton site.
        if (response.data && response.data.data) {
            res.status(200).json(response.data.data);
        } else {
            res.status(200).json(response.data); // Au cas où la structure varie
        }
    } catch (error) {
        // Si ça échoue encore, on essaie l'URL de secours (v1/stats)
        try {
            const fallbackUrl = `https://api.nhle.com/stats/rest/en/${type === 'goalies' ? 'goalie' : 'skater'}/summary?isAggregate=false&isGame=false&fact Cayse=true&sort=[{"property":"points","direction":"DESC"}]&exp=1`;
            const fallbackRes = await axios.get(fallbackUrl);
            res.status(200).json(fallbackRes.data.data);
        } catch (err2) {
            res.status(500).json({ error: "NHL Indisponible", details: error.message });
        }
    }
};
