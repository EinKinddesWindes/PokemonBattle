/**
 * A frosted glass effect card component
 * Used for overlays and content cards with blur backdrop
 */
export default function GlassCard({ children, className = '', padding = 'md' }) {
  const paddings = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6 md:p-8',
    lg: 'p-6 sm:p-8 md:p-10',
  };

  return <div className={`rounded-xl bg-white/30 backdrop-blur-md ${paddings[padding]} ${className}`}>{children}</div>;
}
