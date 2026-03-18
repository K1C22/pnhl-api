export default async function handler(req, res) {
    const { type } = req.query;
    
    // Adresse stable de la NHL pour 2026
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
        : "https://api-web.nhle.com/v1/skater-stats-now/en";

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "NHL_ERROR", code: response.status });
        }
        
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "SERVER_ERROR", details: error.message });
    }
}
