/**
 * Pokemon type badge component with appropriate colors for each type
 */
const typeColors = {
  Fire: 'bg-red-500',
  Water: 'bg-blue-500',
  Grass: 'bg-green-600',
  Normal: 'bg-slate-400',
  Ground: 'bg-amber-700',
  Poison: 'bg-purple-600',
  Flying: 'bg-sky-400',
  Bug: 'bg-lime-600',
  Electric: 'bg-yellow-400',
  Fairy: 'bg-pink-400',
  Psychic: 'bg-fuchsia-500',
  Fighting: 'bg-orange-700',
  Rock: 'bg-stone-600',
  Dark: 'bg-slate-800',
  Ghost: 'bg-violet-700',
  Steel: 'bg-slate-500',
  Dragon: 'bg-indigo-700',
  Ice: 'bg-cyan-400',
};

export default function TypeBadge({ type, size = 'md' }) {
  const bgColor = typeColors[type] || 'bg-gray-400';

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm sm:text-base',
    lg: 'px-4 py-1.5 text-base sm:text-lg',
  };

  return (
    <span className={`inline-block rounded-full font-bold text-white shadow-sm select-none ${bgColor} ${sizes[size]}`}>
      {type}
    </span>
  );
}
