export default async function handler(req, res) {
    const { type } = req.query;
    
    // NOUVELLES ADRESSES NHL (Format 2026 - Nécessite le /en/)
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await fetch(url, {
            headers: {
                // Le User-Agent est obligatoire pour ne pas être bloqué
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL rejette la demande", 
                code: response.status 
            });
        }
        
        const data = await response.json();

        // Autorisations essentielles pour ton site GitHub Pages
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur de connexion", details: error.message });
    }
}
