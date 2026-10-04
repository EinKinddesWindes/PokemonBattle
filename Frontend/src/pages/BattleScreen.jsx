import { useContext, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router';

import Arrow from '../assets/icons/arrow.png';
import AshKetchum from '../assets/images/Ash_Ketchum.png';
import Stadium from '../assets/images/stadium1.png';
import Winner from '../assets/images/Winner.png';
import PokemonCard from '../components/PokemonCard';
import HPBar from '../components/ui/HPBar';
import PixelButton from '../components/ui/PixelButton';
import { PokemonContext } from '../PokemonContext';
import { backGifUrl, frontGifUrl, randomPokemonId } from '../pokemon';

/**
 * Battle Screen - Where the Pokemon battle takes place
 * Features turn-based combat with HP tracking, animations, and fight log
 */
export default function BattleScreen() {
  const navigate = useNavigate();
  const { playerPokemonId, opponentPokemonId } = useLocation().state;
  const { pokemonData, setPlayerPokemonId, setOpponentPokemonId } = useContext(PokemonContext);
  const playerPokemon = pokemonData.find((p) => p.id === playerPokemonId);
  const opponentPokemon = pokemonData.find((p) => p.id === opponentPokemonId);
  const playerFirst = playerPokemon.base.Speed >= opponentPokemon.base.Speed;

  const [playerHP, setPlayerHP] = useState(playerPokemon.base.HP);
  const [opponentHP, setOpponentHP] = useState(opponentPokemon.base.HP);
  const [currentTurn, setCurrentTurn] = useState(playerFirst ? 'player' : 'opponent');
  const [isAttacking, setIsAttacking] = useState(false);
  const [fightLog, setFightLog] = useState(() => [
    `${(playerFirst ? playerPokemon : opponentPokemon).name.english} is faster and attacks first!`,
  ]);
  const logRef = useRef(null);

  const winner = playerHP === 0 ? opponentPokemon : opponentHP === 0 ? playerPokemon : null;

  // Auto-scroll fight log
  useEffect(() => {
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [fightLog]);

  const addToFightLog = (...entries) => setFightLog((prev) => [...prev, ...entries]);

  const handleFight = () => {
    if (winner || isAttacking) return;

    const playerTurn = currentTurn === 'player';
    const [attacker, defender] = playerTurn ? [playerPokemon, opponentPokemon] : [opponentPokemon, playerPokemon];
    setIsAttacking(true);

    setTimeout(() => {
      const useSpecialAttack = Math.random() < 0.25;
      const useSpecialDefense = Math.random() < 0.25;
      const attack = useSpecialAttack ? attacker.base['Sp. Attack'] : attacker.base.Attack;
      const defense = useSpecialDefense ? defender.base['Sp. Defense'] : defender.base.Defense;
      const damage = Math.round(Math.max((attack - (defense / 3) * 2) / 2, 10));
      const defenderHP = Math.max((playerTurn ? opponentHP : playerHP) - damage, 0);

      if (playerTurn) setOpponentHP(defenderHP);
      else setPlayerHP(defenderHP);

      addToFightLog(
        <>
          {attacker.name.english} uses {useSpecialAttack ? 'Special Attack' : 'Base Attack'} (<b>{attack}</b>)
        </>,
        <>
          {defender.name.english} uses {useSpecialDefense ? 'Special Defense' : 'Base Defense'} (<b>{defense}</b>)
        </>,
        <>
          {attacker.name.english} deals <b>{damage}</b> damage!
        </>,
        '───────────',
      );
      if (defenderHP === 0) {
        addToFightLog(
          <>
            <b>{attacker.name.english}</b> wins the battle!
          </>,
        );
      }

      setCurrentTurn(playerTurn ? 'opponent' : 'player');
      setIsAttacking(false);
    }, 800);
  };

  const returnToArena = () => {
    // The winner stays, the loser is swapped for a random challenger
    const randomId = randomPokemonId(pokemonData.length);
    if (winner === playerPokemon) setOpponentPokemonId(randomId);
    else setPlayerPokemonId(randomId);
    navigate('/arena');
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Stadium})` }}>
      <div className="safe-area-inset flex h-full flex-col px-2 py-2 sm:px-4 sm:py-4">
        {/* Main Battle Area */}
        <main className="flex flex-1 flex-col">
          {/* Battle Grid - Cards on sides, battlefield in center */}
          <div className="grid flex-1 grid-cols-1 gap-2 lg:grid-cols-[0.6fr_2fr_0.6fr] lg:px-16 xl:px-28 2xl:px-40">
            {/* Player's Card - Left side (hidden on mobile) */}
            <div className="hidden items-center justify-center lg:flex">
              <PokemonCard pokemonId={playerPokemon.id} size="md" showStats={false} />
            </div>

            {/* Battlefield - Center */}
            <div className="relative flex flex-1 items-center justify-center">
              {/* Fixed aspect-ratio container for consistent GIF positioning */}
              <div className="relative w-full max-w-md overflow-visible" style={{ aspectRatio: '16 / 10' }}>
                {/* Opponent's Pokemon - indicator, HP, GIF */}
                <div className="absolute flex flex-col items-center" style={{ top: '-28%', right: '-10%' }}>
                  {/* Turn indicator - bigger */}
                  <div
                    className={`flex h-20 items-center justify-center sm:h-24 md:h-28 lg:h-32 ${currentTurn === 'opponent' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <img
                      src={Arrow}
                      alt="Opponent's turn"
                      className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
                    />
                  </div>
                  {/* HP Bar */}
                  <HPBar currentHP={opponentHP} maxHP={opponentPokemon.base.HP} />
                  {/* Pokemon GIF */}
                  <div
                    className={`mt-1 transition-transform duration-300 ${
                      isAttacking && currentTurn === 'opponent' ? '-translate-x-2 sm:-translate-x-4' : ''
                    }`}>
                    <img
                      src={frontGifUrl(opponentPokemon.id)}
                      alt={opponentPokemon.name.english}
                      className="h-16 w-auto object-contain sm:h-20 md:h-24 lg:h-28"
                    />
                  </div>
                </div>

                {/* Player's Pokemon - indicator, HP, GIF */}
                <div className="absolute flex flex-col items-center" style={{ top: '0%', left: '-10%' }}>
                  {/* Turn indicator - bigger */}
                  <div
                    className={`flex h-20 items-center justify-center sm:h-24 md:h-28 lg:h-32 ${currentTurn === 'player' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <img
                      src={Arrow}
                      alt="Your turn"
                      className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
                    />
                  </div>
                  {/* HP Bar */}
                  <HPBar currentHP={playerHP} maxHP={playerPokemon.base.HP} />
                  {/* Pokemon GIF */}
                  <div
                    className={`mt-1 transition-transform duration-300 ${
                      isAttacking && currentTurn === 'player' ? 'translate-x-2 sm:translate-x-4' : ''
                    }`}>
                    <img
                      src={backGifUrl(playerPokemon.id)}
                      alt={playerPokemon.name.english}
                      className="h-24 w-auto object-contain sm:h-28 md:h-32 lg:h-36"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent's Card - Right side (hidden on mobile) */}
            <div className="hidden items-center justify-center lg:flex">
              <PokemonCard pokemonId={opponentPokemon.id} size="md" showStats={false} />
            </div>
          </div>

          {/* Mobile Pokemon Cards - shown only on smaller screens */}
          <div className="mt-2 flex justify-center gap-2 lg:hidden">
            <div className="max-w-45 flex-1">
              <PokemonCard pokemonId={playerPokemon.id} size="sm" showStats={false} />
            </div>
            <div className="max-w-45 flex-1">
              <PokemonCard pokemonId={opponentPokemon.id} size="sm" showStats={false} />
            </div>
          </div>

          {/* Attack Button - centered at bottom */}
          <div className="flex justify-center py-4">
            <PixelButton onClick={handleFight} disabled={isAttacking || winner !== null}>
              Attack!
            </PixelButton>
          </div>
        </main>

        {/* Fight Log - Fixed bottom-left corner */}
        <div
          ref={logRef}
          className="fixed bottom-4 left-4 z-40 h-36 w-56 overflow-y-auto rounded-lg bg-white/90 p-2 text-gray-900 shadow-lg sm:h-44 sm:w-64 sm:p-3 md:h-52 md:w-72">
          <h3 className="mb-1 text-xs font-bold sm:text-sm">Battle Log</h3>
          {fightLog.map((log, index) => (
            <p key={index} className="text-[10px] sm:text-xs">
              {log}
            </p>
          ))}
        </div>

        {/* Ash Ketchum - Same position as Arena */}
        <div className="pointer-events-none fixed bottom-0 left-[15%] hidden lg:block">
          <img src={AshKetchum} alt="Ash Ketchum" className="h-80 w-auto object-contain xl:h-96" />
        </div>

        {/* Winner popup */}
        {winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <div className="animate-slide-up rounded-lg bg-white p-10 text-center text-gray-900 shadow-lg">
              <img src={Winner} alt="Winner" className="mx-auto mb-4 h-auto w-48" />
              <h2 className="text-2xl font-bold">{winner.name.english} Wins!</h2>
              <img src={frontGifUrl(winner.id)} alt={winner.name.english} className="mx-auto my-4 h-36 w-auto" />
              <button onClick={returnToArena} className="btn btn-primary mt-4">
                Back to Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
