export default async function handler(req, res) {
    const { type } = req.query;

    // URLS EXACTES NHL 2026 (Le /en/ est désormais obligatoire pour le format JSON)
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await fetch(url, {
            headers: {
                // User-Agent complet de Chrome pour éviter le blocage automatique (404/403)
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "NHL_REJECTED", 
                code: response.status,
                url_tente: url
            });
        }

        const data = await response.json();

        // Autorisations CORS pour ton site GitHub Pages
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "SERVER_ERROR", details: error.message });
    }
}
