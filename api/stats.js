export default async function handler(req, res) {
    // On récupère le type depuis l'URL (ex: ?type=goalies)
    const { type } = req.query;
    
    // Définition de l'URL NHL selon le type
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur NHL");
        
        const data = await response.json();

        // AUTORISATIONS : Crucial pour débloquer GitHub Pages
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur de connexion", details: error.message });
    }
}
