const games = [];

const gameForm = (req, res) => {
  res.render("games/gameForm", { games });
}

const saveGame = (req, res) => {
    const { title, genre, platform, cost, description } = req.body;
    games.push({ title, genre, platform, cost, description });
    res.redirect('/gameForm');
}

const gamesController = {
    gameForm,
    saveGame,
};

module.exports = gamesController;