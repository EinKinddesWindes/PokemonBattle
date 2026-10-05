import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// PokéAPI's GraphQL endpoint returns every Pokémon in one request (the REST API would need one per Pokémon)
const QUERY = `{
  pokemon(where: {is_default: {_eq: true}}, order_by: {id: asc}) {
    id
    pokemonspecy { pokemonspeciesnames(where: {language: {name: {_eq: "en"}}}) { name } }
    pokemontypes(order_by: {slot: asc}) { type { name } }
    pokemonstats(order_by: {stat_id: asc}) { base_stat stat { name } }
    pokemonsprites { sprites(path: "other.showdown") }
  }
}`;

const STATS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

// Reshape PokéAPI's data into the format the frontend already uses
async function fetchPokemon() {
  const res = await fetch('https://graphql.pokeapi.co/v1beta2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  });
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);

  // Only Pokémon with front and back GIFs (the newest ones don't have them yet) can battle. The frontend picks random
  // ids from 1 to the number of Pokémon, so the list stops at the first gap
  return data.pokemon
    .filter((p) => p.pokemonsprites[0].sprites.front_default && p.pokemonsprites[0].sprites.back_default)
    .filter((p, i) => p.id === i + 1)
    .map((p) => ({
      id: p.id,
      name: { english: p.pokemonspecy.pokemonspeciesnames[0].name },
      type: p.pokemontypes.map((t) => capitalize(t.type.name)),
      base: Object.fromEntries(p.pokemonstats.map((s) => [STATS[s.stat.name], s.base_stat])),
    }));
}

// ponytail: fetched once at startup, so new Pokémon show up after a restart and the server won't start while PokéAPI is down
const pokemonData = await fetchPokemon();

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
