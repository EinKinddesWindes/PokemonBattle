import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Arena from './pages/Arena';
import BattleScreen from './pages/BattleScreen';
import Login from './pages/Login';
import Pokedex from './pages/Pokedex';
import { PokemonContext } from './PokemonContext';

export default function App() {
  const [playerPokemonId, setPlayerPokemonId] = useState(null);
  const [opponentPokemonId, setOpponentPokemonId] = useState(null);
  const [username, setUsername] = useState('Trainer');
  const [pokemonData, setPokemonData] = useState([]);

  return (
    <PokemonContext
      value={{
        playerPokemonId,
        setPlayerPokemonId,
        opponentPokemonId,
        setOpponentPokemonId,
        username,
        setUsername,
        pokemonData,
        setPokemonData,
      }}>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Every other page needs the data Login fetches, so a refresh or deep link starts over at Login */}
        {pokemonData.length > 0 && (
          <>
            <Route path="/arena" element={<Arena />} />
            <Route path="/pokedex/:player" element={<Pokedex />} />
            <Route path="/battle" element={<BattleScreen />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PokemonContext>
  );
}
