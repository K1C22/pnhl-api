export default async function handler(req, res) {
    const { type } = req.query;
    
    // NOUVELLES ADRESSES NHL (Format 2026)
    // On ajoute /en/ et le paramètre ?report pour éviter le 404
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now?report=skater-summary";

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL ne répond pas à cette adresse", 
                code: response.status 
            });
        }
        
        const data = await response.json();

        // Autorisations pour ton site GitHub Pages
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
}
