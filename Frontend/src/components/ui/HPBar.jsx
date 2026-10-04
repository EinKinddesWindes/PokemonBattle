import HeartIcon from '../../assets/icons/heart.svg';

export default function HPBar({ currentHP, maxHP }) {
  const percentage = (currentHP / maxHP) * 100;
  // Gameboy green / yellow / red
  const barColor = percentage > 50 ? 'bg-[#88c070]' : percentage > 25 ? 'bg-[#f8d858]' : 'bg-[#e85048]';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        <img src={HeartIcon} alt="HP" className="size-7" />
        <span
          className="font-pixel text-base font-bold text-white"
          style={{
            textShadow:
              '-0.0625em -0.0625em 0 #000, 0.0625em -0.0625em 0 #000, -0.0625em 0.0625em 0 #000, 0.0625em 0.0625em 0 #000, -0.125em 0 0 #000, 0.125em 0 0 #000, 0 -0.125em 0 #000, 0 0.125em 0 #000',
          }}>
          {currentHP}
        </span>
      </div>
      <div className="min-w-24 border-2 border-black bg-[#303030] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]">
        <div className="h-4 w-full bg-[#181818]">
          <div
            className={`h-4 transition-all duration-300 ease-out ${barColor}`}
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
