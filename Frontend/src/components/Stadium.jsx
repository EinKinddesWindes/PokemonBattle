import AshKetchum from '../assets/images/Ash_Ketchum.avif';
import StadiumImage from '../assets/images/stadium1.avif';
import { backGifUrl, frontGifUrl } from '../pokemon';
import PokemonCard from './PokemonCard';

// Arena and battle share this screen: both Pokémon face each other on the field, their cards left and right.
// It's sized in rem, which index.css scales with the window (.stage), so it looks the same at every size.
export default function Stadium({
  playerId,
  opponentId,
  attacker,
  header,
  footer,
  playerControls,
  opponentControls,
  playerHud,
  opponentHud,
}) {
  return (
    <div className="stage fixed inset-0 overflow-hidden bg-slate-900">
      {/* In portrait the field gets the top half, zoomed in a bit, and the cards go below it */}
      <div className="@container-size absolute inset-x-0 top-0 h-full overflow-hidden portrait:h-1/2 portrait:mask-b-from-85%">
        {/* Exactly the area a cover-fitted background fills, so the Pokémon stand on the field at every size */}
        <div
          className="@container absolute top-1/2 left-1/2 aspect-video w-[max(100cqw,177.8cqh)] -translate-1/2 bg-cover portrait:top-[62%] portrait:w-[max(125cqw,222.2cqh)]"
          style={{ backgroundImage: `url(${StadiumImage})` }}>
          {/* Feet in the middle of each one's quarter of the field (% of the stadium image). The player comes second so it stands in front */}
          <Fighter
            src={frontGifUrl(opponentId)}
            alt="Opponent Pokemon"
            hud={opponentHud}
            animation={
              attacker === 'opponent' ? 'motion-safe:animate-lunge-opponent' : attacker ? 'motion-safe:animate-hit' : ''
            }
            className="top-[48%] left-[64%]"
            imgClassName="h-[7.5cqw]"
          />
          <Fighter
            src={backGifUrl(playerId)}
            alt="Your Pokemon"
            hud={playerHud}
            animation={
              attacker === 'player' ? 'motion-safe:animate-lunge-player' : attacker ? 'motion-safe:animate-hit' : ''
            }
            className="top-[59.5%] left-[33%]"
            imgClassName="h-[9.5cqw]"
          />
        </div>
      </div>

      <div className="relative mx-auto flex h-full max-w-[178vh] flex-col gap-4 p-6">
        <header className="flex justify-center">{header}</header>

        <main className="flex flex-1 items-center justify-between portrait:items-end portrait:justify-center portrait:gap-4">
          <section className="flex flex-col items-center gap-2">
            {playerControls}
            <PokemonCard pokemonId={playerId} />
          </section>
          <section className="flex flex-col items-center gap-2">
            {opponentControls}
            <PokemonCard pokemonId={opponentId} />
          </section>
        </main>

        <footer className="flex justify-center">
          {/* Ash stands right next to the button, on the bottom edge of the screen */}
          <div className="relative">
            <img
              src={AshKetchum}
              alt="Ash Ketchum"
              className="pointer-events-none absolute right-full -bottom-6 -mr-16 h-72 max-w-none portrait:hidden"
            />
            {footer}
          </div>
        </footer>
      </div>
    </div>
  );
}

function Fighter({ src, alt, hud, animation, className, imgClassName }) {
  return (
    <div className={`absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1 ${className}`}>
      {hud}
      <img src={src} alt={alt} className={`w-auto ${animation} ${imgClassName}`} />
    </div>
  );
}
