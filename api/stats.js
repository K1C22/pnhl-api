export default async function handler(req, res) {
    const { type } = req.query;
    
    // ADRESSES OFFICIELLES ET STABLES
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "La NHL rejette la demande", 
                code: response.status 
            });
        }
        
        const data = await response.json();

        // Indispensable pour ton site GitHub Pages
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur de connexion", details: error.message });
    }
}
