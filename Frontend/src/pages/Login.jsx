import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import PikachuRunning from '../assets/icons/pikachu_running.avif';
import Wallpaper from '../assets/images/wallpaper2.avif';
import { PokemonContext } from '../PokemonContext';
import { randomPokemonId } from '../pokemon';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://pokemonbattle-5ur0.onrender.com';

export default function Login() {
  const { username, setUsername, pokemonData, setPokemonData, setPlayerPokemonId, setOpponentPokemonId } =
    useContext(PokemonContext);
  const navigate = useNavigate();
  const loaded = pokemonData.length > 0;
  const [secondsWaited, setSecondsWaited] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [nameTooLong, setNameTooLong] = useState(false);

  // Fetch Pokemon data and tick the fake progress bar until it arrives (the free-tier server usually wakes within ~80s)
  useEffect(() => {
    if (loaded || loadError) return;

    fetch(`${API_URL}/pokemon`)
      .then((res) => res.json())
      .then((data) => {
        // The server sends { error } instead of the list when PokéAPI is down
        if (data.error) return setLoadError(data.error);
        setPokemonData(data);
        setPlayerPokemonId(randomPokemonId(data.length));
        setOpponentPokemonId(randomPokemonId(data.length));
      })
      .catch(() => setLoadError('Could not load the Pokémon. Please check your connection and try again.'));

    const interval = setInterval(() => setSecondsWaited((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [loaded, loadError, setPokemonData, setPlayerPokemonId, setOpponentPokemonId]);

  const progress = Math.min((secondsWaited / 80) * 100, 100);

  const showNote = secondsWaited >= 5;
  const note = (
    <p className="mt-4 max-w-sm text-center text-sm font-semibold text-red-800 sm:text-base">
      The server just needs to restart. Give it up to a minute, then you can catch 'em all!
    </p>
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setUsername(new FormData(e.currentTarget).get('username').trim());
    navigate('/arena');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${Wallpaper})` }}>
      {loadError ? (
        <div className="frosted flex max-w-sm flex-col items-center p-6 text-center">
          <p className="text-base font-semibold text-red-800 sm:text-lg">{loadError}</p>
          <button onClick={() => setLoadError(null)} className="btn btn-primary mt-4">
            Try again
          </button>
        </div>
      ) : !loaded ? (
        // An awake server answers within a second, so only show the loader once it's clearly still asleep
        secondsWaited >= 1 && (
          <div className="w-full max-w-md">
            <div className="frosted flex flex-col items-center p-6">
              <div className="relative h-6 w-full overflow-hidden rounded-lg bg-gray-300 shadow-inner sm:h-8">
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />

                <img
                  src={PikachuRunning}
                  alt="Loading..."
                  className="absolute h-8 w-auto sm:h-10"
                  style={{ left: `${Math.min(progress, 95)}%`, top: '50%', transform: 'translate(-50%, -60%)' }}
                />
              </div>

              <p className="mt-4 text-center text-base font-bold text-gray-800 sm:text-lg md:text-xl">
                Waking up the server...
                <span className="ml-2 inline-block w-12 text-center">{Math.floor(progress)}%</span>
              </p>

              {showNote && note}
            </div>

            {/* Until the note shows up, its space stays free under the box. Then it moves into the box, which grows
                into that space, so the box stays centered as a whole and the loader doesn't jump */}
            {!showNote && <div className="invisible flex flex-col items-center px-6">{note}</div>}
          </div>
        )
      ) : (
        <div className="frosted animate-slide-up w-full max-w-xs p-6 sm:max-w-sm sm:p-8 md:p-10">
          <h2 className="mb-6 text-center text-xl font-bold wrap-anywhere text-gray-900 sm:text-2xl md:text-3xl">
            Welcome
            <br />
            {username}!
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              name="username"
              required
              maxLength={20}
              pattern=".*\S.*"
              title="Use 1 to 20 characters"
              // maxLength silently drops the 21st letter, so shake like for an empty name
              onBeforeInput={(e) => {
                const input = e.currentTarget;
                if (input.value.length >= input.maxLength && input.selectionStart === input.selectionEnd)
                  setNameTooLong(true);
              }}
              onAnimationEnd={() => setNameTooLong(false)}
              className={`input user-invalid:animate-shake w-full border-gray-300 bg-gray-100 text-lg text-gray-700 placeholder:text-gray-500/70 user-invalid:border-red-500 focus:border-red-500 sm:text-xl ${nameTooLong ? 'animate-shake' : ''}`}
              placeholder="Enter your name"
              autoComplete="username"
            />

            <button type="submit" className="btn btn-primary w-full text-base font-bold sm:text-lg">
              Enter Arena
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
