export default async function handler(req, res) {
    const { type } = req.query;

    // URLS OFFICIELLES DE PRODUCTION NHL 2026
    // Ces adresses sont celles qui fournissent les vrais fichiers JSON de statistiques
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL rejette la connexion", 
                code: response.status 
            });
        }

        const data = await response.json();

        // Ajout des Headers CORS pour permettre à ton GitHub Pages de lire les données
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        // On envoie les données directement
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
}
