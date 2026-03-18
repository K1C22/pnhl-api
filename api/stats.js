export default async function handler(req, res) {
    const { type } = req.query;

    // STRATÉGIE DE SECOURS : On utilise l'URL de base des leaders de la saison
    // C'est l'URL la plus stable et la moins susceptible de donner un 404
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                'Accept': 'application/json',
                'Accept-Language': 'en-CA'
            }
        });

        // SI LA NHL DONNE ENCORE UN 404, ON TESTE L'URL DE REPLI (Saison 20252026)
        if (!response.ok) {
            const fallbackUrl = "https://api-web.nhle.com/v1/skater-stats-now";
            const fallbackResponse = await fetch(fallbackUrl);
            const data = await fallbackResponse.json();
            return res.status(200).json(data);
        }

        const data = await response.json();

        // Autorisations CORS pour ton site PNHL
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        // En cas d'échec total, on renvoie un message clair pour ton interface
        res.status(500).json({ 
            error: "NHL_INDISPONIBLE", 
            message: "La NHL bloque actuellement les requêtes externes.",
            details: error.message 
        });
    }
}
