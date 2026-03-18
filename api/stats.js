export default async function handler(req, res) {
    // On récupère le type depuis l'URL (ex: ?type=goalies)
    const { type } = req.query;
    
    // Définition de l'URL NHL selon le type
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";
try {
        // AJOUT DES HEADERS POUR FAIRE CROIRE À LA NHL QU'ON EST UN NAVIGATEUR
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) throw new Error(`La NHL a répondu avec le code : ${response.status}`);
        
        const data = await response.json();

        // Tes autorisations habituelles
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Échec de l'appel NHL", details: error.message });
    }
}
