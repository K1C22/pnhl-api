export default async function handler(req, res) {
    const { type } = req.query;

    // CES URLS SONT CELLES DU SITE OFFICIEL NHL (Utilisées en mars 2026)
    // Elles incluent le paramètre "isAggregate=false" pour avoir le détail par joueur
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now?isAggregate=false&isGame=false";

    try {
        const response = await fetch(url, {
            headers: {
                // On imite parfaitement un navigateur Chrome pour ne pas être rejeté
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Origin': 'https://www.nhl.com',
                'Referer': 'https://www.nhl.com/'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL rejette encore la connexion", 
                code: response.status,
                url_tente: url
            });
        }

        const data = await response.json();

        // --- CONFIGURATION CORS (Pour que ton GitHub Pages puisse lire) ---
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        // On envoie le JSON complet à ton site
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "ERREUR_SERVEUR", details: error.message });
    }
}
