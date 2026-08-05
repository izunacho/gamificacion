import { Coins, Heart, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { expToNextLevel, computeTitle } from '../utils/leveling';
import { StatBar } from './StatBar';
import { ATTRIBUTE_LABELS, type AttributeKey } from '../types';
import { ATTRIBUTE_STYLE } from '../utils/attributeStyle';

export function AvatarCard() {
  const avatar = useGameStore((s) => s.avatar);
  const expNeeded = expToNextLevel(avatar.level);
  const title = computeTitle(avatar.attributes, avatar.level);
  const attributeKeys = Object.keys(avatar.attributes) as AttributeKey[];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-slate-950/60 p-5 shadow-xl shadow-black/30">
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
    </div>
  );
}
