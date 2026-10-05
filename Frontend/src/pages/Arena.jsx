import { useContext } from 'react';
import { useNavigate } from 'react-router';

import PixelButton from '../components/ui/PixelButton';
import Stadium from '../components/Stadium';
import { PokemonContext } from '../PokemonContext';
import { randomPokemonId } from '../pokemon';

export default function Arena() {
  const { username, pokemonData, playerPokemonId, setPlayerPokemonId, opponentPokemonId, setOpponentPokemonId } =
    useContext(PokemonContext);
  const navigate = useNavigate();

  const startBattle = () => navigate('/battle', { state: { playerPokemonId, opponentPokemonId } });

  return (
    <Stadium
      playerId={playerPokemonId}
      opponentId={opponentPokemonId}
      header={
        <h1 className="frosted px-4 py-3 text-center text-3xl font-bold wrap-anywhere text-gray-900">
          Welcome, {username}!
        </h1>
      }
      playerControls={
        <div className="flex gap-2">
          <button onClick={() => navigate('/pokedex/myPokemon')} className="btn btn-primary">
            Choose Pokemon
          </button>
          <button onClick={() => setPlayerPokemonId(randomPokemonId(pokemonData.length))} className="btn btn-secondary">
            Random
          </button>
        </div>
      }
      opponentControls={
        <div className="flex gap-2">
          <button onClick={() => navigate('/pokedex/opponent')} className="btn btn-primary">
            Choose Opponent
          </button>
          <button
            onClick={() => setOpponentPokemonId(randomPokemonId(pokemonData.length))}
            className="btn btn-secondary">
            Random
          </button>
        </div>
      }
      footer={<PixelButton onClick={startBattle}>Fight!</PixelButton>}
    />
  );
}
