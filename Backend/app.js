import cors from 'cors';
import express from 'express';
import pokemonData from './pokemondata.json' with { type: 'json' };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const findPokemon = (id) => pokemonData.find((p) => p.id === Number(id));

app.get('/pokemon', (req, res) => res.send(pokemonData));

app.get('/pokemon/:id', (req, res) => {
  const pokemon = findPokemon(req.params.id);
  if (pokemon) res.send(pokemon);
  else res.sendStatus(404);
});

app.get('/pokemon/:id/:info', (req, res) => {
  const { id, info } = req.params;
  const pokemon = findPokemon(id);
  // hasOwn: don't serve inherited keys like /pokemon/1/constructor
  if (pokemon && Object.hasOwn(pokemon, info)) res.send({ [info]: pokemon[info] });
  else res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
