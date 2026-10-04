import { useContext } from 'react';
import { useNavigate } from 'react-router';

import AshKetchum from '../assets/images/Ash_Ketchum.avif';
import Stadium from '../assets/images/stadium1.avif';
import PokemonCard from '../components/PokemonCard';
import PixelButton from '../components/ui/PixelButton';
import { PokemonContext } from '../PokemonContext';
import { backGifUrl, frontGifUrl, randomPokemonId } from '../pokemon';

export default function Arena() {
  const { username, pokemonData, playerPokemonId, setPlayerPokemonId, opponentPokemonId, setOpponentPokemonId } =
    useContext(PokemonContext);
  const navigate = useNavigate();

  const startBattle = () => navigate('/battle', { state: { playerPokemonId, opponentPokemonId } });

  return (
    <div
      className="fixed inset-0 overflow-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Stadium})` }}>
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        {/* Matches the background's aspect ratio so the GIFs stay on the same spot of the stadium */}
        <div className="relative size-full max-h-screen max-w-[177.78vh]" style={{ aspectRatio: '16 / 9' }}>
          <div className="absolute top-[44%] right-[38%] -translate-y-1/2 2xl:top-[46%]">
            <img
              src={frontGifUrl(opponentPokemonId)}
              alt="Opponent Pokemon"
              className="h-16 w-auto object-contain sm:h-20 md:h-24 lg:h-28"
            />
          </div>

          <div className="absolute top-[54%] left-[38%] -translate-y-1/2 2xl:top-[56%]">
            <img
              src={backGifUrl(playerPokemonId)}
              alt="Your Pokemon"
              className="h-24 w-auto object-contain sm:h-28 md:h-32 lg:h-36"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto flex min-h-full flex-col">
        <header className="mb-4 flex justify-center sm:mb-6">
          <div className="rounded-xl bg-white/30 p-3 text-center backdrop-blur-md sm:p-4">
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl">Welcome, {username}!</h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 lg:gap-6">
          <div className="3xl:mt-24 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <section className="flex flex-col items-center">
              <div className="mb-2 flex flex-wrap justify-center gap-2">
                <button onClick={() => navigate('/pokedex/myPokemon')} className="btn btn-primary btn-sm sm:btn-md">
                  Choose Pokemon
                </button>
                <button
                  onClick={() => setPlayerPokemonId(randomPokemonId(pokemonData.length))}
                  className="btn btn-secondary btn-sm sm:btn-md">
                  Random
                </button>
              </div>
              <PokemonCard pokemonId={playerPokemonId} size="md" />
            </section>

            {/* Empty middle column, the GIFs above stand here */}
            <section className="hidden lg:block" />

            <section className="flex flex-col items-center">
              <div className="mb-2 flex flex-wrap justify-center gap-2">
                <button onClick={() => navigate('/pokedex/opponent')} className="btn btn-primary btn-sm sm:btn-md">
                  Choose Opponent
                </button>
                <button
                  onClick={() => setOpponentPokemonId(randomPokemonId(pokemonData.length))}
                  className="btn btn-secondary btn-sm sm:btn-md">
                  Random
                </button>
              </div>
              <PokemonCard pokemonId={opponentPokemonId} size="md" />
            </section>
          </div>

          <div className="mt-auto flex justify-center pb-4 sm:pb-6 lg:pb-8">
            <PixelButton onClick={startBattle}>Fight!</PixelButton>
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-0 left-[15%] hidden lg:block">
          <img src={AshKetchum} alt="Ash Ketchum" className="h-80 w-auto object-contain xl:h-96" />
        </div>
      </div>
    </div>
  );
}
