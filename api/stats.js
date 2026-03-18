export default async function handler(req, res) {
    const { type } = req.query;
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Autorise ton site GitHub Pages à lire les données
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données NHL" });
    }
}
