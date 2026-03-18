const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // On autorise ton site GitHub Pages à appeler cette API
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const type = req.query.type || 'skaters';
  const url = type === 'goalies' 
    ? "https://www.marqueur.com/hockey/stats/nhl/stats.php?t=4" 
    : "https://www.marqueur.com/hockey/stats/nhl/stats.php";

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const $ = cheerio.load(data);
    const players = [];

    // On cible le tableau de stats de Marqueur
    $('table tr').each((i, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 10 && i > 0) {
        players.push({
          rank: $(cols[0]).text().trim(),
          name: $(cols[1]).text().trim(),
          team: $(cols[2]).text().trim(),
          pj: $(cols[3]).text().trim(),
          b: $(cols[4]).text().trim(),
          a: $(cols[5]).text().trim(),
          pts: $(cols[6]).text().trim(),
          moy: $(cols[9]).text().trim() // Pour les gardiens
        });
      }
    });

    res.status(200).json(players.slice(0, 100));
  } catch (error) {
    res.status(500).json({ error: "Erreur de lecture sur Marqueur" });
  }
};
