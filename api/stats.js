export default async function handler(req, res) {
    const { type } = req.query;
    const targetUrl = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    // On utilise un proxy public pour contourner le blocage IP de Vercel
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Les données de la NHL sont cachées dans data.contents sous forme de texte
        const nhlData = JSON.parse(data.contents);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(nhlData);

    } catch (error) {
        res.status(500).json({ error: "Le contournement a échoué", details: error.message });
    }
}
