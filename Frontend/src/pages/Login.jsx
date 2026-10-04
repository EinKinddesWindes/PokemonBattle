import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import PikachuRunning from '../assets/icons/pikachu_running.avif';
import Wallpaper from '../assets/images/wallpaper2.avif';
import { PokemonContext } from '../PokemonContext';
import { randomPokemonId } from '../pokemon';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://pokemonbattle-5ur0.onrender.com';

/**
 * Login page - Entry point for the Pokemon Battle game
 * Shows loading progress while fetching Pokemon data, then presents login form
 */
export default function Login() {
  const { username, setUsername, pokemonData, setPokemonData, setPlayerPokemonId, setOpponentPokemonId } =
    useContext(PokemonContext);
  const navigate = useNavigate();
  const loaded = pokemonData.length > 0;
  const [secondsWaited, setSecondsWaited] = useState(0);

  // Fetch Pokemon data and tick the fake progress bar until it arrives (the free-tier server usually wakes within ~80s)
  useEffect(() => {
    if (loaded) return;

    fetch(`${API_URL}/pokemon`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonData(data);
        setPlayerPokemonId(randomPokemonId(data.length));
        setOpponentPokemonId(randomPokemonId(data.length));
      })
      .catch((error) => console.error('Error fetching Pokémon data:', error));

    const interval = setInterval(() => setSecondsWaited((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [loaded, setPokemonData, setPlayerPokemonId, setOpponentPokemonId]);

  const progress = Math.min((secondsWaited / 80) * 100, 100);

  const onSubmit = (e) => {
    e.preventDefault();
    setUsername(new FormData(e.currentTarget).get('username'));
    navigate('/arena');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${Wallpaper})` }}>
      {/* Loading State */}
      {!loaded ? (
        <div className="flex w-full max-w-md flex-col items-center justify-center px-4">
          {/* Progress Bar Container */}
          <div className="relative h-6 w-full overflow-hidden rounded-lg bg-gray-300 shadow-inner sm:h-8">
            {/* Progress Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

            {/* Pikachu Running GIF */}
            <img
              src={PikachuRunning}
              alt="Loading..."
              className="absolute h-8 w-auto sm:h-10"
              style={{ left: `${Math.min(progress, 95)}%`, top: '50%', transform: 'translate(-50%, -60%)' }}
            />
          </div>

          {/* Progress Text */}
          <p className="mt-4 text-center text-base font-bold text-gray-800 sm:text-lg md:text-xl">
            Waking up the server...
            <span className="ml-2 inline-block w-12 text-center">{Math.floor(progress)}%</span>
          </p>

          {/* Extended Loading Message */}
          {secondsWaited >= 5 && (
            <p className="mt-4 max-w-sm text-center text-sm font-semibold text-red-600 sm:text-base">
              Sorry, but sometimes the server needs up to 10 minutes to restart. Please wait...
            </p>
          )}
        </div>
      ) : (
        /* Login Form */
        <div className="animate-slide-up w-full max-w-xs rounded-xl bg-white/30 p-6 backdrop-blur-md sm:max-w-sm sm:p-8 md:p-10">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
            Welcome
            <br />
            {username}!
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              name="username"
              required
              className="input user-invalid:animate-shake w-full border-gray-300 bg-gray-100 text-lg text-gray-700 placeholder:text-gray-500/70 user-invalid:border-red-500 focus:border-red-500 sm:text-xl"
              placeholder="Enter your name"
              autoComplete="username"
            />

            <button type="submit" className="btn btn-primary w-full cursor-pointer text-base font-bold sm:text-lg">
              Enter Arena
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
