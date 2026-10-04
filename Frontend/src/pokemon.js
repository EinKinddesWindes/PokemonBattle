// PokeAPI asset URLs are deterministic per Pokédex id, so no API round-trip is needed
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';

export const artworkUrl = (id) => `${SPRITES}/official-artwork/${id}.png`;
export const frontGifUrl = (id) => `${SPRITES}/showdown/${id}.gif`;
export const backGifUrl = (id) => `${SPRITES}/showdown/back/${id}.gif`;

export const playCry = (id) => {
  const cry = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
  cry.volume = 0.015;
  cry.play().catch(() => {}); // autoplay may be blocked
};

// ids in pokemondata.json run 1..count without gaps
export const randomPokemonId = (count) => Math.floor(Math.random() * count) + 1;
