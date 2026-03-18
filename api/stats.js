const axios = require('axios');

module.exports = async (req, res) => {
  // Autoriser ton site web (GitHub Pages) à appeler cette fonction
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  const { type } = req.query; // 'skaters' ou 'goalies'
  
  // URLs officielles de l'API Web de la NHL
  const url = type === 'goalies' 
    ? "https://api-web.nhle.com/v1/goalie-stats-now/en" 
    : "https://api-web.nhle.com/v1/skater-stats-now/en";

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    // On renvoie uniquement les données essentielles (le tableau 'data')
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Erreur NHL:", error.message);
    res.status(500).json({ error: "La NHL bloque la connexion. Réessaie plus tard." });
  }
};
