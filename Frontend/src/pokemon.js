// PokeAPI sprite URLs are deterministic per Pokédex id, so no API round-trip is needed
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';

export const artworkUrl = (id) => `${SPRITES}/official-artwork/${id}.png`;
export const frontGifUrl = (id) => `${SPRITES}/showdown/${id}.gif`;
export const backGifUrl = (id) => `${SPRITES}/showdown/back/${id}.gif`;

// ids in pokemondata.json run 1..count without gaps
export const randomPokemonId = (count) => Math.floor(Math.random() * count) + 1;
