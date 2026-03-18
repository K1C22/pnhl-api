export default async function handler(req, res) {
    const { type } = req.query;
    
    // NOUVELLES ADRESSES NHL OFFICIELLES (Format 2026)
    // On utilise "skater-stats-now" avec les bons paramètres de rapport
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url, {
            headers: {
                // Sans ce "User-Agent", la NHL bloque la requête avec une erreur
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        // Si la NHL renvoie une erreur (comme ton 404), on l'attrape ici
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL refuse l'accès", 
                code: response.status,
                url_tentee: url 
            });
        }
        
        const data = await response.json();

        // Autorisations pour ton site PNHL
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur de serveur", details: error.message });
    }
}
