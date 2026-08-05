import { CheckCircle2, Circle, Flame, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AvatarCard } from '../components/AvatarCard';
import { useGameStore } from '../store/useGameStore';
import { ATTRIBUTE_STYLE } from '../utils/attributeStyle';

export function Dashboard() {
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const storyQuests = useGameStore((s) => s.storyQuests);

  const completedToday = dailyQuests.filter((q) => q.completedToday).length;
  const activeStoryQuests = storyQuests.filter((q) => !q.completed);

  return (
    <div className="space-y-6">
      <AvatarCard />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Misiones de hoy</h2>
          <Link to="/misiones" className="text-xs font-medium text-indigo-300 hover:text-indigo-200">
            Ver todas
          </Link>
        </div>

        {dailyQuests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/40">
            Todavía no tienes hábitos diarios. Crea uno en la pestaña Misiones.
          </p>
        ) : (
          <>
            <div className="mb-2 text-xs text-white/40">
              {completedToday} / {dailyQuests.length} completadas
            </div>
            <div className="space-y-2">
              {dailyQuests.map((q) => {
                const style = ATTRIBUTE_STYLE[q.attribute];
                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-3 rounded-xl border border-white/10 p-3 ${
                      q.completedToday ? 'opacity-50' : 'bg-white/[0.03]'
                    }`}
                  >
                    {q.completedToday ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-white/30" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{q.name}</p>
                    </div>
                    {q.streak > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-orange-300">
                        <Flame size={12} />
                        {q.streak}
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${style.text}`}>+{q.expReward} EXP</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Proyectos activos</h2>
          <Link to="/proyectos" className="text-xs font-medium text-indigo-300 hover:text-indigo-200">
            Ver todos
          </Link>
        </div>

        {activeStoryQuests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/40">
            No tienes proyectos activos. Crea una misión de historia en la pestaña Proyectos.
          </p>
        ) : (
          <div className="space-y-2">
            {activeStoryQuests.map((q) => {
              const done = q.subtasks.filter((s) => s.done).length;
              const pct = q.subtasks.length > 0 ? Math.round((done / q.subtasks.length) * 100) : 0;
              return (
                <div key={q.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <ScrollText size={16} className="text-violet-300" />
                    <p className="text-sm font-medium text-white">{q.title}</p>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {done} / {q.subtasks.length} subtareas
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
