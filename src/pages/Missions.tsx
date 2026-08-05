import { useState } from 'react';
import { CheckCircle2, Circle, Coins, Flame, HeartCrack, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { ATTRIBUTE_LABELS, type AttributeKey } from '../types';
import { ATTRIBUTE_STYLE } from '../utils/attributeStyle';
import { Modal } from '../components/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '../components/formStyles';

const ATTRIBUTE_KEYS: AttributeKey[] = ['fuerza', 'enfoque', 'salud', 'disciplina'];

export function Missions() {
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const completeDailyQuest = useGameStore((s) => s.completeDailyQuest);
  const deleteDailyQuest = useGameStore((s) => s.deleteDailyQuest);
  const [showForm, setShowForm] = useState(false);

  const completedToday = dailyQuests.filter((q) => q.completedToday).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Misiones diarias</h1>
          <p className="text-sm text-white/40">
            {completedToday} / {dailyQuests.length} completadas hoy
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          <Plus size={16} />
          Nuevo hábito
        </button>
      </div>

      {dailyQuests.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
          Aún no tienes hábitos. Crea el primero para empezar a ganar EXP.
        </p>
      ) : (
        <div className="space-y-2">
          {dailyQuests.map((quest) => {
            const style = ATTRIBUTE_STYLE[quest.attribute];
            const Icon = style.icon;
            return (
              <div
                key={quest.id}
                className={`rounded-xl border border-white/10 p-4 transition ${
                  quest.completedToday ? 'bg-white/[0.02] opacity-60' : 'bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => completeDailyQuest(quest.id)}
                    disabled={quest.completedToday}
                    className="mt-0.5 shrink-0 disabled:cursor-default"
                    aria-label="Completar misión"
                  >
                    {quest.completedToday ? (
                      <CheckCircle2 size={22} className="text-emerald-400" />
                    ) : (
                      <Circle size={22} className="text-white/30 hover:text-white/60" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{quest.name}</p>
                    {quest.description && <p className="mt-0.5 text-xs text-white/40">{quest.description}</p>}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 font-semibold ${style.text}`}>
                        <Icon size={12} />
                        {ATTRIBUTE_LABELS[quest.attribute]}
                      </span>
                      <span className="flex items-center gap-1 text-indigo-300">
                        <Sparkles size={12} /> +{quest.expReward} EXP
                      </span>
                      <span className="flex items-center gap-1 text-yellow-300">
                        <Coins size={12} /> +{quest.goldReward}
                      </span>
                      <span className="flex items-center gap-1 text-rose-300">
                        <HeartCrack size={12} /> -{quest.hpPenalty} si falla
                      </span>
                      {quest.streak > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-orange-300">
                          <Flame size={12} /> {quest.streak} días
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDailyQuest(quest.id)}
                    className="shrink-0 rounded-md p-1.5 text-white/30 hover:bg-white/10 hover:text-rose-300"
                    aria-label="Eliminar hábito"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <NewQuestForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function NewQuestForm({ onClose }: { onClose: () => void }) {
  const addDailyQuest = useGameStore((s) => s.addDailyQuest);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState<AttributeKey>('disciplina');
  const [expReward, setExpReward] = useState(30);
  const [goldReward, setGoldReward] = useState(10);
  const [hpPenalty, setHpPenalty] = useState(10);

  const canSubmit = name.trim().length > 0 && expReward > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    addDailyQuest({
      name: name.trim(),
      description: description.trim(),
      attribute,
      expReward,
      goldReward,
      hpPenalty,
    });
    onClose();
  }

  return (
    <Modal title="Nuevo hábito diario" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Nombre</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Hacer 20 min de ejercicio"
            autoFocus
          />
        </div>
        <div>
          <label className={labelClass}>Descripción (opcional)</label>
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles del hábito"
          />
        </div>
        <div>
          <label className={labelClass}>Atributo que entrena</label>
          <div className="grid grid-cols-2 gap-2">
            {ATTRIBUTE_KEYS.map((key) => {
              const style = ATTRIBUTE_STYLE[key];
              const Icon = style.icon;
              const active = attribute === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setAttribute(key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active ? `border-transparent ${style.soft} ${style.text}` : 'border-white/10 text-white/50 hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {ATTRIBUTE_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelClass}>EXP</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={expReward}
              onChange={(e) => setExpReward(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Oro</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={goldReward}
              onChange={(e) => setGoldReward(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Penalización</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={hpPenalty}
              onChange={(e) => setHpPenalty(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancelar
          </button>
          <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
            Crear hábito
          </button>
        </div>
      </form>
    </Modal>
  );
}
