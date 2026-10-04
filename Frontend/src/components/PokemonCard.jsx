import {
  faFistRaised,
  faHeartbeat,
  faMeteor,
  faShieldAlt,
  faShieldVirus,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef } from 'react';
import { PokemonContext } from '../PokemonContext';
import { artworkUrl, playCry } from '../pokemon';
import StatBar from './ui/StatBar';
import TypeBadge from './ui/TypeBadge';

const sizes = {
  sm: {
    container: 'w-[180px] sm:w-[200px]',
    image: 'w-16 h-16 sm:w-20 sm:h-20',
    title: 'text-xs sm:text-sm',
    padding: 'p-1',
  },
  md: {
    container: 'w-[220px] sm:w-[250px]',
    image: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
    title: 'text-sm sm:text-base md:text-lg',
    padding: 'p-2',
  },
};

/**
 * Pokemon Card component - displays a Pokemon with its image, type, and stats
 * Fully responsive and reusable across the application
 */
export default function PokemonCard({ pokemonId, size = 'md', showStats = true, playHoverSound = false }) {
  const { pokemonData } = useContext(PokemonContext);
  const pokemon = pokemonData.find((p) => p.id === pokemonId);
  const hoverTimeoutRef = useRef(null);
  const s = sizes[size];

  // Don't play a pending cry after the card is gone (e.g. it was clicked)
  useEffect(() => () => clearTimeout(hoverTimeoutRef.current), []);

  const handleMouseEnter = () => {
    if (playHoverSound) hoverTimeoutRef.current = setTimeout(() => playCry(pokemonId), 500);
  };

  return (
    <div className={`w-full ${s.padding}`}>
      <div
        className={`card relative mx-auto w-full ${s.container} cursor-pointer rounded-3xl border-2 border-gray-400 bg-linear-to-br from-[#e8d5b7] via-[#e3c6a0] to-[#e3b47b] shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => clearTimeout(hoverTimeoutRef.current)}>
        {/* Pokemon Image */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <div className={`${s.image} rounded-full bg-white shadow-inner`}>
            <img
              src={artworkUrl(pokemonId)}
              alt={pokemon.name.english}
              className="h-full w-full rounded-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Pokemon Details */}
        <div className="p-2 text-center sm:p-3">
          <h3 className={`font-extrabold text-gray-800 ${s.title}`}>{pokemon.name.english}</h3>

          {/* Type Badges */}
          <div className="mt-1 flex flex-wrap justify-center gap-1 sm:mt-2 sm:gap-2">
            {pokemon.type.map((type) => (
              <TypeBadge key={type} type={type} size={size} />
            ))}
          </div>

          {/* Base Stats */}
          {showStats && (
            <div className="mt-2 grid grid-cols-2 gap-1 sm:mt-3 sm:gap-1.5">
              <StatBar icon={faHeartbeat} label="HP" value={pokemon.base.HP} color="green" size={size} />
              <StatBar icon={faTachometerAlt} label="Speed" value={pokemon.base.Speed} color="yellow" size={size} />
              <StatBar icon={faFistRaised} label="Atk" value={pokemon.base.Attack} color="red" size={size} />
              <StatBar icon={faShieldAlt} label="Def" value={pokemon.base.Defense} color="blue" size={size} />
              <StatBar icon={faMeteor} label="S-Atk" value={pokemon.base['Sp. Attack']} color="orange" size={size} />
              <StatBar
                icon={faShieldVirus}
                label="S-Def"
                value={pokemon.base['Sp. Defense']}
                color="purple"
                size={size}
              />
            </div>
          )}
        </div>

        {/* Decorative border */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-gray-400" />
      </div>
    </div>
  );
}
