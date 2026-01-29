import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PokemonCard from '../components/PokemonCard';
import { PokemonContext } from '../context/PokemonContext';

/**
 * Pokedex page - Browse and select Pokemon from the full roster
 * Features responsive grid, search/filter, and smooth navigation
 */
export default function Pokedex() {
  const { pokemonData, setPlayerPokemonId, setOpponentPokemonId } = useContext(PokemonContext);
  const navigate = useNavigate();
  const { player } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Get unique Pokemon types for filter
  const allTypes = [...new Set(pokemonData.flatMap((p) => p.type))].sort();

  // Filter Pokemon based on search and type
  const filteredPokemon = pokemonData.filter((pokemon) => {
    const matchesSearch = pokemon.name.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || pokemon.type.includes(selectedType);
    return matchesSearch && matchesType;
  });

  const handleCardClick = (id) => {
    if (player === 'myPokemon') {
      setPlayerPokemonId(id);
    } else if (player === 'opponent') {
      setOpponentPokemonId(id);
    }
    navigate('/arena');
  };

  const isSelectingPlayer = player === 'myPokemon';

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="safe-area-inset mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <header className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/arena')} className="btn btn-ghost btn-sm sm:btn-md text-white">
                ← Back
              </button>
              <h1 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl md:text-3xl">
                {isSelectingPlayer ? 'Choose Your Pokemon' : 'Choose Opponent'}
              </h1>
            </div>

            {/* Search & Filter */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <input
                type="text"
                placeholder="Search Pokemon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full bg-white/90 text-gray-900 placeholder:text-gray-500 sm:w-48 md:w-64"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select select-bordered w-full bg-white/90 text-gray-900 sm:w-36">
                <option value="">All Types</option>
                {allTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="mt-2 text-center text-sm text-white/70 sm:text-left">
            Showing {filteredPokemon.length} of {pokemonData.length} Pokemon
          </p>
        </header>

        {/* Pokemon Grid - Give cards more breathing room */}
        <main>
          {filteredPokemon.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white">
              <p className="text-lg">No Pokemon found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                }}
                className="btn btn-ghost mt-4">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {filteredPokemon.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="w-[calc(50%-0.5rem)] sm:w-auto"
                  onClick={() => handleCardClick(pokemon.id)}>
                  <PokemonCard pokemonId={pokemon.id} size="sm" showStats={true} playHoverSound={true} />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </div>
  );
}

/**
 * Scroll to top button component
 */
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-4 bottom-4 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white shadow-lg transition-transform hover:scale-110 hover:bg-slate-600 active:scale-95 sm:h-14 sm:w-14"
      aria-label="Scroll to top">
      <span className="text-xl sm:text-2xl">↑</span>
    </button>
  );
}
