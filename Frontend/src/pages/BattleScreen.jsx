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
import { backGifUrl, frontGifUrl, playCry, randomPokemonId } from '../pokemon';

const pixelDivider = (
  <div className="relative z-20 mx-auto mb-4 flex items-center justify-center gap-1">
    <div className="h-1 w-4 bg-yellow-400" />
    <div className="h-1 w-2 bg-white" />
    <div className="h-1 w-8 bg-yellow-400" />
    <div className="h-1 w-2 bg-white" />
    <div className="h-1 w-4 bg-yellow-400" />
  </div>
);

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
    playCry(attacker.id);

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
            <PixelButton onClick={handleFight} size="lg" disabled={isAttacking || winner !== null}>
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

        {/* Winner Modal - Retro SNES Victory Screen */}
        {winner && (
          <>
            {/* Confetti behind the modal */}
            {/* ponytail: sized once when the modal opens, add a resize listener if that ever matters */}
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={true}
              numberOfPieces={300}
              colors={['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB', '#32CD32']}
            />

            {/* Dark backdrop with blur */}
            <div className="animate-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
              <div className="animate-slide-down-slow relative w-full max-w-sm sm:max-w-md">
                {/* Main retro card - sharp edges, hard shadow, pixel border */}
                <div
                  className="relative overflow-hidden border-4 border-white bg-[#0f0f2d] p-6 sm:p-8"
                  style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1), -2px -2px 0px 0px rgba(80,80,120,0.5)' }}>
                  {/* CRT Scanline overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)',
                    }}
                  />

                  {/* Inner pixel border accent */}
                  <div className="pointer-events-none absolute inset-2 border-2 border-yellow-400/60" />

                  {/* VICTORY! header - pixel font, solid yellow, no gradient */}
                  <div className="relative z-20 mb-2 text-center">
                    <h1
                      className="font-pixel text-xl text-yellow-400 sm:text-2xl md:text-3xl"
                      style={{ textShadow: '2px 2px 0px #b8860b, 4px 4px 0px rgba(0,0,0,0.8)' }}>
                      VICTORY!
                    </h1>
                  </div>

                  {/* Decorative pixel divider */}
                  {pixelDivider}

                  {/* Trophy image - pixelated rendering */}
                  <div className="relative z-20 mx-auto mb-3 w-fit">
                    <img
                      src={Winner}
                      alt="Winner!"
                      className="relative mx-auto h-auto w-24 sm:w-28"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>

                  {/* Winner name - pixel font, solid white */}
                  <h2
                    className="font-pixel relative z-20 mb-1 text-center text-lg text-white sm:text-xl md:text-2xl"
                    style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
                    {winner.name.english}
                  </h2>
                  <p
                    className="font-pixel relative z-20 mb-4 text-center text-xs text-yellow-400 sm:text-sm"
                    style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8)' }}>
                    WINS THE BATTLE!
                  </p>

                  {/* Pokemon sprite showcase - pixelated, bouncing */}
                  <div className="relative z-20 my-4 flex justify-center">
                    <img
                      src={frontGifUrl(winner.id)}
                      alt={winner.name.english}
                      className="animate-retro-bounce h-32 w-auto sm:h-40"
                      style={{ imageRendering: 'pixelated', transform: 'scale(1.2)' }}
                    />
                  </div>

                  {/* Pixel divider before button */}
                  {pixelDivider}

                  {/* Retro button using PixelButton component */}
                  <div className="relative z-20">
                    <PixelButton onClick={returnToArena} size="md" className="w-full">
                      <span className="animate-text-blink">{'>'}</span>
                      &nbsp;BACK TO ARENA&nbsp;
                      <span className="animate-text-blink">{'<'}</span>
                    </PixelButton>
                  </div>
                </div>

                {/* Pixel sparkle decorations at corners */}
                <div className="animate-pixel-sparkle absolute -top-2 -left-2 h-2 w-2 bg-yellow-400" />
                <div
                  className="animate-pixel-sparkle absolute -top-2 -right-2 h-2 w-2 bg-white"
                  style={{ animationDelay: '0.3s' }}
                />
                <div
                  className="animate-pixel-sparkle absolute -bottom-2 -left-2 h-2 w-2 bg-white"
                  style={{ animationDelay: '0.6s' }}
                />
                <div
                  className="animate-pixel-sparkle absolute -right-2 -bottom-2 h-2 w-2 bg-yellow-400"
                  style={{ animationDelay: '0.9s' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
