export default async function handler(req, res) {
    const { type } = req.query;

    // URLS OFFICIELLES NHL 2026 (Nécessitent le format de rapport précis)
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now?report=skater-summary";

    try {
        const response = await fetch(url, {
            headers: {
                // Sans ce déguisement de navigateur, la NHL bloque avec un 404 ou 403
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL refuse la connexion", 
                code: response.status 
            });
        }

        const data = await response.json();

        // Autorisations pour ton interface Admin PNHL
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
}
