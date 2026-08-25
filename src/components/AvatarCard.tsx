import { lazy, Suspense, useState } from 'react';
import { Coins, Heart, Pencil, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { expToNextLevel, computeTitle, getDominantKey } from '../utils/leveling';
import { StatBar } from './StatBar';
import { ATTRIBUTE_LABELS, type AttributeKey } from '../types';
import { ATTRIBUTE_STYLE } from '../utils/attributeStyle';

const AvatarViewer = lazy(() => import('../three/AvatarViewer').then((m) => ({ default: m.AvatarViewer })));
const CustomizeAvatarModal = lazy(() =>
  import('./CustomizeAvatarModal').then((m) => ({ default: m.CustomizeAvatarModal })),
);

export function AvatarCard() {
  const avatar = useGameStore((s) => s.avatar);
  const expNeeded = expToNextLevel(avatar.level);
  const title = computeTitle(avatar.attributes, avatar.level);
  const dominantAttribute = getDominantKey(avatar.attributes, avatar.level);
  const attributeKeys = Object.keys(avatar.attributes) as AttributeKey[];
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-slate-950/60 p-5 shadow-xl shadow-black/30">
      <div className="relative -mx-5 -mt-5 mb-4 h-56 overflow-hidden rounded-t-2xl bg-gradient-to-b from-indigo-900/30 to-transparent">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-24 w-24 animate-pulse rounded-full bg-white/5" />
            </div>
          }
        >
          <AvatarViewer
            appearance={avatar.appearance}
            level={avatar.level}
            dominantAttribute={dominantAttribute}
            className="h-full w-full"
          />
        </Suspense>
        <button
          onClick={() => setShowCustomize(true)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm hover:bg-black/60 hover:text-white"
        >
          <Pencil size={12} />
          Personalizar
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">{title}</p>
          <h1 className="text-2xl font-bold text-white">{avatar.name}</h1>
          <p className="mt-0.5 text-sm text-white/50">Nivel {avatar.level}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-300 ring-1 ring-yellow-500/30">
            <Coins size={14} />
            {avatar.gold}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <StatBar
          value={avatar.hp}
          max={avatar.maxHp}
          colorClass="bg-gradient-to-r from-rose-600 to-rose-400"
          label={
            <span className="flex items-center gap-1">
              <Heart size={12} /> Vida
            </span>
          }
          valueLabel={`${avatar.hp} / ${avatar.maxHp}`}
        />
        <StatBar
          value={avatar.exp}
          max={expNeeded}
          colorClass="bg-gradient-to-r from-indigo-500 to-fuchsia-500"
          label={
            <span className="flex items-center gap-1">
              <Sparkles size={12} /> EXP
            </span>
          }
          valueLabel={`${avatar.exp} / ${expNeeded}`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {attributeKeys.map((key) => {
          const style = ATTRIBUTE_STYLE[key];
          const Icon = style.icon;
          return (
            <div key={key} className={`rounded-xl p-3 ${style.soft}`}>
              <div className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${style.text}`}>
                <Icon size={14} />
                {ATTRIBUTE_LABELS[key]}
              </div>
              <p className="text-lg font-bold text-white">{avatar.attributes[key]}</p>
            </div>
          );
        })}
      </div>

      {showCustomize && (
        <Suspense fallback={null}>
          <CustomizeAvatarModal onClose={() => setShowCustomize(false)} />
        </Suspense>
      )}
    </div>
  );
}
