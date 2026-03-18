export default async function handler(req, res) {
    // 1. On récupère le type (skaters ou goalies) depuis l'URL (ex: ?type=goalies)
    const { type } = req.query;
    
    // 2. On définit l'URL de la NHL selon le besoin
    const url = type === 'goalies' 
        ? "https://api-web.nhle.com/v1/goalie-stats-now" 
        : "https://api-web.nhle.com/v1/skater-stats-now";

    try {
        // 3. Le serveur Vercel appelle l'API de la NHL
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Erreur de réponse NHL");
        
        const data = await response.json();

        // 4. CONFIGURATION CRUCIALE : On autorise ton site GitHub à lire les données
        // C'est ce qui règle le problème de blocage (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Content-Type', 'application/json');

        // 5. On renvoie les données proprement à ton site
        res.status(200).json(data);

    } catch (error) {
        // En cas d'erreur, on prévient le navigateur
        res.status(500).json({ error: "Impossible de joindre la NHL", details: error.message });
    }
}
