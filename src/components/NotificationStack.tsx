import { useEffect } from 'react';
import { Coins, Flame, Heart, PartyPopper, ShoppingBag, Skull, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import type { GameNotification } from '../types';

const NOTIFICATION_STYLE: Record<GameNotification['type'], { icon: typeof Sparkles; className: string }> = {
  exp: { icon: Sparkles, className: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-100' },
  gold: { icon: Coins, className: 'border-yellow-400/40 bg-yellow-500/10 text-yellow-100' },
  levelup: { icon: PartyPopper, className: 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-100' },
  penalty: { icon: Heart, className: 'border-rose-400/40 bg-rose-500/10 text-rose-100' },
  defeat: { icon: Skull, className: 'border-red-500/50 bg-red-600/15 text-red-100' },
  info: { icon: Flame, className: 'border-white/20 bg-white/10 text-white' },
  purchase: { icon: ShoppingBag, className: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' },
};

const AUTO_DISMISS_MS = 3200;

export function NotificationStack() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);

  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n) =>
      setTimeout(() => dismissNotification(n.id), AUTO_DISMISS_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, dismissNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3">
      {notifications.map((n) => {
        const style = NOTIFICATION_STYLE[n.type];
        const Icon = style.icon;
        return (
          <div
            key={n.id}
            className={`animate-float-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md ${style.className}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs opacity-80">{n.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
