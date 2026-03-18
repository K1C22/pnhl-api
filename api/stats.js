const axios = require('axios');

module.exports = async (req, res) => {
    // Autorisations de sécurité (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const type = req.query.type || 'skaters';
    
    // Utilisation des endpoints de l'API Web officielle (plus stables)
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await axios.get(url, {
            timeout: 5000, // 5 secondes max pour répondre
            headers: { 
                // Simulation d'un vrai navigateur pour éviter le rejet "Non disponible"
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Origin': 'https://www.nhl.com',
                'Referer': 'https://www.nhl.com/'
            }
        });
        
        // On renvoie les données à ton index.html
        res.status(200).json(response.data.data);
    } catch (error) {
        console.error("Erreur détaillée:", error.message);
        res.status(500).json({ 
            error: "La NHL bloque la requête", 
            details: error.message 
        });
    }
};
