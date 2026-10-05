// PokeAPI sprite URLs are deterministic per Pokédex id, so no API round-trip is needed
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';

export const artworkUrl = (id) => `${SPRITES}/official-artwork/${id}.png`;
export const frontGifUrl = (id) => `${SPRITES}/showdown/${id}.gif`;
export const backGifUrl = (id) => `${SPRITES}/showdown/back/${id}.gif`;

// The newest Pokémon have no Showdown GIFs yet, so they show their official artwork instead
export const showArtworkOnError = (id) => (e) => (e.currentTarget.src = artworkUrl(id));

// ids from PokéAPI run 1..count without gaps
export const randomPokemonId = (count) => Math.floor(Math.random() * count) + 1;
