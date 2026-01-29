import axios from 'axios';

/**
 * Fetch Pokemon cry/sound from PokeAPI
 * Returns an object with 'latest' and 'legacy' cry URLs
 */
export const GetPokemonCry = async (pokemonId) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = response.data;

    // PokeAPI v2.9.0+ includes cries
    return {
      latest: data.cries?.latest || null,
      legacy: data.cries?.legacy || null,
    };
  } catch (error) {
    console.error(`Error fetching pokemon cry: ${error}`);
    return { latest: null, legacy: null };
  }
};

export const GetPokemonImage = async (pokemonId) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = response.data;

    // Try different properties
    const imageUrl =
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.other.dream_world.front_default ||
      data.sprites.front_default;

    return imageUrl;
  } catch (error) {
    // console.error(`Error fetching the pokemon image: ${error}`);
  }
};

export const GetPokemonFrontGIF = async (pokemonId) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = response.data;

    // Try different properties for front animation
    const imageUrl =
      data.sprites.other.showdown.front_default ||
      data.sprites.other['generation-v'].front_default ||
      data.sprites.front_default;

    return imageUrl;
  } catch (error) {
    //console.error(`Error fetching the pokemon front image: ${error}`);
  }
};

export const GetPokemonBackGIF = async (pokemonId) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = response.data;

    // Try different properties for back animation
    const imageUrl =
      data.sprites.other.showdown.back_default ||
      data.sprites.other['generation-v'].back_default ||
      data.sprites.back_default;

    return imageUrl;
  } catch (error) {
    // console.error(`Error fetching the pokemon back image: ${error}`);
  }
};
