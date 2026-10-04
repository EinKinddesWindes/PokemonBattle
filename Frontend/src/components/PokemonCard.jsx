import {
  faFistRaised,
  faHeartbeat,
  faMeteor,
  faShieldAlt,
  faShieldVirus,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { PokemonContext } from '../PokemonContext';
import { artworkUrl } from '../pokemon';
import StatBar from './ui/StatBar';
import TypeBadge from './ui/TypeBadge';

const sizes = {
  sm: {
    container: 'w-45 sm:w-50',
    image: 'size-16 sm:size-20',
    title: 'text-xs sm:text-sm',
    padding: 'p-1',
  },
  // Arena and battle, scaled with the window there
  md: {
    container: 'w-62.5',
    image: 'size-32',
    title: 'text-lg',
    padding: 'p-2',
  },
};

export default function PokemonCard({ pokemonId, size = 'md' }) {
  const { pokemonData } = useContext(PokemonContext);
  const pokemon = pokemonData.find((p) => p.id === pokemonId);
  const s = sizes[size];

  return (
    <div className={`w-full ${s.padding}`}>
      <div
        className={`card relative mx-auto w-full ${s.container} rounded-3xl border-2 border-gray-400 bg-linear-to-br from-[#e8d5b7] via-[#e3c6a0] to-[#e3b47b] shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-2xl`}>
        <div className="flex justify-center pt-4 sm:pt-6">
          <div className={`${s.image} rounded-full bg-white shadow-inner`}>
            <img
              src={artworkUrl(pokemonId)}
              alt={pokemon.name.english}
              className="size-full rounded-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-2 text-center sm:p-3">
          <h3 className={`font-extrabold text-gray-800 ${s.title}`}>{pokemon.name.english}</h3>

          <div className="mt-1 flex flex-wrap justify-center gap-1 sm:mt-2 sm:gap-2">
            {pokemon.type.map((type) => (
              <TypeBadge key={type} type={type} size={size} />
            ))}
          </div>

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
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-gray-400" />
      </div>
    </div>
  );
}
