import { useContext, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router';

import Arrow from '../assets/icons/arrow.avif';
import Winner from '../assets/images/Winner.avif';
import Stadium from '../components/Stadium';
import HPBar from '../components/ui/HPBar';
import PixelButton from '../components/ui/PixelButton';
import { PokemonContext } from '../PokemonContext';
import { frontGifUrl, randomPokemonId } from '../pokemon';

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

  // Keep the newest log entry in view
  useEffect(() => {
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [fightLog]);

  const addToFightLog = (...entries) => setFightLog((prev) => [...prev, ...entries]);

  const handleFight = () => {
    if (winner || isAttacking) return;

    const playerTurn = currentTurn === 'player';
    const [attacker, defender] = playerTurn ? [playerPokemon, opponentPokemon] : [opponentPokemon, playerPokemon];
    setIsAttacking(true);

    // The hit lands when the attacker reaches the defender, halfway through the lunge (index.css)
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
    }, 350);

    setTimeout(() => {
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

  const hud = (side, hp, maxHP) => (
    <>
      <img
        src={Arrow}
        alt={side === 'player' ? 'Your turn' : "Opponent's turn"}
        className={`size-20 transition-opacity duration-300 ${currentTurn === side ? 'opacity-100' : 'opacity-0'}`}
      />
      <HPBar currentHP={hp} maxHP={maxHP} />
    </>
  );

  return (
    <>
      <Stadium
        playerId={playerPokemon.id}
        opponentId={opponentPokemon.id}
        battle
        attacker={isAttacking ? currentTurn : null}
        playerHud={hud('player', playerHP, playerPokemon.base.HP)}
        opponentHud={hud('opponent', opponentHP, opponentPokemon.base.HP)}
        header={
          <div
            ref={logRef}
            className="h-36 w-sm max-w-full overflow-y-auto rounded-lg bg-white/90 px-3 py-2 text-gray-900 shadow-lg portrait:h-24">
            <h3 className="mb-1 text-sm font-bold">Battle Log</h3>
            {fightLog.map((log, index) => (
              <p key={index} className="text-xs">
                {log}
              </p>
            ))}
          </div>
        }
        footer={
          <PixelButton onClick={handleFight} disabled={isAttacking || winner !== null}>
            Attack!
          </PixelButton>
        }
      />

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
    </>
  );
}
