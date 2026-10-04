import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    label: 'text-[0.5625rem]',
    value: 'text-xs min-w-6',
    bar: 'h-1.5 mt-0.5',
  },
  md: {
    container: 'p-1.5',
    icon: 'text-base',
    label: 'text-xs',
    value: 'text-sm min-w-7',
    bar: 'h-2 mt-1',
  },
};

// Logarithmic scale so low stats stay visible: 5 → 0%, 255 → 100%, never below 5%
const barWidth = (value) => Math.max((Math.log(Math.max(value, 5) / 5) / Math.log(255 / 5)) * 100, 5);

export default function StatBar({ icon, label, value, color, size }) {
  const s = sizes[size];
  const c = colorClasses[color];

  return (
    <div className={`flex w-full flex-col items-center overflow-hidden rounded-lg bg-white shadow-md ${s.container}`}>
      <div className="flex w-full items-center gap-0.5">
        <FontAwesomeIcon icon={icon} className={`shrink-0 ${s.icon} ${c.text}`} />
        <span className={`min-w-0 flex-1 truncate text-center text-gray-700 ${s.label}`}>{label}</span>
        <span className={`shrink-0 text-right font-bold ${s.value} ${c.text}`}>{value}</span>
      </div>
      <div className={`w-full rounded-full bg-gray-300 ${s.bar}`}>
        <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${barWidth(value)}%` }} />
      </div>
    </div>
  );
}
