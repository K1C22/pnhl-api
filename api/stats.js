export default async function handler(req, res) {
    // 1. On récupère le type (ex: ?type=goalies)
    const { type } = req.query;

    // 2. Définition de l'URL NHL (Format 2026 stable avec langue)
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        // 3. Appel à la NHL avec un seul User-Agent propre
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        // 4. Gestion d'erreur si la NHL refuse
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL a répondu avec une erreur", 
                code: response.status 
            });
        }

        const data = await response.json();

        // 5. Autorisations pour ton site PNHL (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        // 6. Envoi des données
        res.status(200).json(data);

    } catch (error) {
        // En cas de plantage total du serveur
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
}
