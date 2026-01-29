import pokemonData from '../pokemondata.json' with { type: 'json' };

const getAllPokemon = (req, res) => {
  res.send(pokemonData);
};

const getPokemonById = (req, res) => {
  const { id } = req.params;
  const pokemon = pokemonData.find((p) => p.id === parseInt(id));

  if (pokemon) {
    res.send(pokemon);
  } else {
    res.status(404).send(`Pokemon with ID ${id} not found`);
  }
};

const getPokemonInfoById = (req, res) => {
  const { id, info } = req.params;
  const pokemon = pokemonData.find((p) => p.id === parseInt(id));
  if (pokemon && pokemon[info]) {
    res.send({ [info]: pokemon[info] });
  } else {
    res.status(404).send(`Info ${info} for Pokemon with ID ${id} not found`);
  }
};

export default {
  getAllPokemon,
  getPokemonById,
  getPokemonInfoById,
};
