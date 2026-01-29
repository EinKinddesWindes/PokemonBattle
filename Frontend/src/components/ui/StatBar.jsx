import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * A stat bar component for displaying Pokemon statistics
 * Features icon, label, value, and animated progress bar
 */
export default function StatBar({ icon, label, value, color, maxValue = 255, size = 'sm' }) {
  // Logarithmic scale for better visualization of Pokemon stats
  const calculateBarWidth = (val) => {
    const minValue = 5;
    const maxVal = maxValue;
    const logValue = Math.log(Math.max(val, minValue));
    const logMin = Math.log(minValue);
    const logMax = Math.log(maxVal);
    const barWidth = ((logValue - logMin) / (logMax - logMin)) * 100;
    return Math.max(barWidth, 5);
  };

  const colorClasses = {
    green: { text: 'text-green-500', bg: 'bg-green-500' },
    yellow: { text: 'text-yellow-500', bg: 'bg-yellow-500' },
    red: { text: 'text-red-500', bg: 'bg-red-500' },
    blue: { text: 'text-blue-500', bg: 'bg-blue-500' },
    orange: { text: 'text-orange-500', bg: 'bg-orange-500' },
    purple: { text: 'text-purple-500', bg: 'bg-purple-500' },
  };

  const sizes = {
    sm: {
      container: 'p-1',
      icon: 'text-sm',
      label: 'text-[9px]',
      value: 'text-xs min-w-[24px]',
      bar: 'h-1.5 mt-0.5',
    },
    md: {
      container: 'p-1.5',
      icon: 'text-base',
      label: 'text-[10px]',
      value: 'text-sm min-w-[28px]',
      bar: 'h-2 mt-1',
    },
    lg: {
      container: 'p-2',
      icon: 'text-lg',
      label: 'text-xs',
      value: 'text-base min-w-[32px]',
      bar: 'h-2.5 mt-1',
    },
  };

  const s = sizes[size] || sizes.sm;
  const c = colorClasses[color] || colorClasses.green;

  return (
    <div className={`flex w-full flex-col items-center overflow-hidden rounded-lg bg-white shadow-md ${s.container}`}>
      <div className="flex w-full items-center gap-0.5">
        <FontAwesomeIcon icon={icon} className={`shrink-0 ${s.icon} ${c.text}`} />
        <span className={`min-w-0 flex-1 truncate text-center text-gray-700 ${s.label}`}>{label}</span>
        <span className={`shrink-0 text-right font-bold ${s.value} ${c.text}`}>{value}</span>
      </div>
      <div className={`w-full rounded-full bg-gray-300 ${s.bar}`}>
        <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${calculateBarWidth(value)}%` }} />
      </div>
    </div>
  );
}
