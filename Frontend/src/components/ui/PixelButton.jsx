const baseClasses = `
  font-pixel relative inline-flex items-center justify-center cursor-pointer
  rounded-none border-[0.25rem] border-white bg-red-500
  px-14 py-6 text-4xl
  text-white font-bold
  shadow-[0.25rem_0.25rem_0_0_rgba(0,0,0,1)]
  transition-all duration-100
  [clip-path:polygon(0_0.5rem,0.5rem_0.5rem,0.5rem_0,calc(100%-0.5rem)_0,calc(100%-0.5rem)_0.5rem,100%_0.5rem,100%_calc(100%-0.5rem),calc(100%-0.5rem)_calc(100%-0.5rem),calc(100%-0.5rem)_100%,0.5rem_100%,0.5rem_calc(100%-0.5rem),0_calc(100%-0.5rem))]
  hover:scale-105 hover:brightness-125 hover:border-yellow-300
  hover:shadow-[0_0_0_0.25rem_rgba(0,0,0,1),0_0_1.25rem_rgba(255,255,100,0.6)]
  active:scale-100 active:brightness-90 active:shadow-[0.125rem_0.125rem_0_0_rgba(0,0,0,1)]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100
`;

export default function PixelButton(props) {
  return <button className={baseClasses} {...props} />;
}
