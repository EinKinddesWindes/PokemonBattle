import HeartIcon from '../../assets/icons/heart.svg';

export default function HPBar({ currentHP, maxHP }) {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  // Gameboy green / yellow / red
  const barColor = percentage > 50 ? 'bg-[#88c070]' : percentage > 25 ? 'bg-[#f8d858]' : 'bg-[#e85048]';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        <img src={HeartIcon} alt="HP" className="size-6 sm:size-7" />
        <span
          className="font-pixel text-sm font-bold text-white sm:text-base"
          style={{
            textShadow:
              '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
          }}>
          {currentHP}
        </span>
      </div>
      <div
        className="min-w-20 border-2 border-black bg-[#303030] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] sm:min-w-24"
        style={{ imageRendering: 'pixelated' }}>
        <div className="h-3 w-full bg-[#181818] sm:h-4">
          <div
            className={`h-3 transition-all duration-300 ease-out sm:h-4 ${barColor}`}
            style={{
              width: `${percentage}%`,
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
