import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Coins,
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { ATTRIBUTE_LABELS, type AttributeKey } from '../types';
import { ATTRIBUTE_STYLE } from '../utils/attributeStyle';
import { Modal } from '../components/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '../components/formStyles';

const ATTRIBUTE_KEYS: AttributeKey[] = ['fuerza', 'enfoque', 'salud', 'disciplina'];

export function Projects() {
  const storyQuests = useGameStore((s) => s.storyQuests);
  const [showForm, setShowForm] = useState(false);

  const active = storyQuests.filter((q) => !q.completed);
  const completed = storyQuests.filter((q) => q.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Misiones de historia</h1>
          <p className="text-sm text-white/40">Proyectos grandes divididos en subtareas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          <Plus size={16} />
          Nuevo proyecto
        </button>
      </div>

      {active.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
          No tienes proyectos activos. Crea uno para dividir un objetivo grande en pasos.
        </p>
      )}

      <div className="space-y-3">
        {active.map((quest) => (
          <StoryQuestCard key={quest.id} questId={quest.id} />
        ))}
      </div>

      {completed.length > 0 && (
        <div>
          <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-white/50">
            Completados
          </h2>
          <div className="space-y-2">
            {completed.map((quest) => (
              <div
                key={quest.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 opacity-60"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium text-white">{quest.title}</span>
                </div>
                <DeleteQuestButton questId={quest.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && <NewProjectForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function DeleteQuestButton({ questId }: { questId: string }) {
  const deleteStoryQuest = useGameStore((s) => s.deleteStoryQuest);
  return (
    <button
      onClick={() => deleteStoryQuest(questId)}
      className="rounded-md p-1.5 text-white/30 hover:bg-white/10 hover:text-rose-300"
      aria-label="Eliminar proyecto"
    >
      <Trash2 size={16} />
    </button>
  );
}

function StoryQuestCard({ questId }: { questId: string }) {
  const quest = useGameStore((s) => s.storyQuests.find((q) => q.id === questId));
  const toggleSubtask = useGameStore((s) => s.toggleSubtask);
  const deleteSubtask = useGameStore((s) => s.deleteSubtask);
  const addSubtask = useGameStore((s) => s.addSubtask);
  const [newSubtask, setNewSubtask] = useState('');

  if (!quest) return null;

  const style = ATTRIBUTE_STYLE[quest.attribute];
  const Icon = style.icon;
  const done = quest.subtasks.filter((s) => s.done).length;
  const pct = quest.subtasks.length > 0 ? Math.round((done / quest.subtasks.length) * 100) : 0;

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask(questId, newSubtask.trim(), 20);
    setNewSubtask('');
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <ScrollText size={18} className="mt-0.5 shrink-0 text-violet-300" />
          <div>
            <p className="font-semibold text-white">{quest.title}</p>
            {quest.description && <p className="text-xs text-white/40">{quest.description}</p>}
          </div>
        </div>
        <DeleteQuestButton questId={quest.id} />
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className={`flex items-center gap-1 font-semibold ${style.text}`}>
          <Icon size={12} />
          {ATTRIBUTE_LABELS[quest.attribute]}
        </span>
        <span className="flex items-center gap-1 text-indigo-300">
          <Sparkles size={12} /> +{quest.completionExpReward} EXP al terminar
        </span>
        <span className="flex items-center gap-1 text-yellow-300">
          <Coins size={12} /> +{quest.completionGoldReward}
        </span>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-violet-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-white/40">
          {done} / {quest.subtasks.length} subtareas
        </p>
      </div>

      <div className="mt-3 space-y-1.5">
        {quest.subtasks.map((st) => (
          <div key={st.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-2.5 py-2">
            <button onClick={() => toggleSubtask(questId, st.id)} className="shrink-0">
              {st.done ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <Circle size={18} className="text-white/30 hover:text-white/60" />
              )}
            </button>
            <span className={`min-w-0 flex-1 truncate text-sm ${st.done ? 'text-white/40 line-through' : 'text-white'}`}>
              {st.title}
            </span>
            <span className="shrink-0 text-xs text-indigo-300">+{st.expReward} EXP</span>
            <button
              onClick={() => deleteSubtask(questId, st.id)}
              className="shrink-0 rounded-md p-1 text-white/20 hover:bg-white/10 hover:text-rose-300"
              aria-label="Eliminar subtarea"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSubtask} className="mt-2 flex gap-2">
        <input
          className={inputClass}
          placeholder="Añadir subtarea..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-white/10 px-3 text-sm font-medium text-white hover:bg-white/20"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}

function NewProjectForm({ onClose }: { onClose: () => void }) {
  const addStoryQuest = useGameStore((s) => s.addStoryQuest);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState<AttributeKey>('disciplina');
  const [completionExpReward, setCompletionExpReward] = useState(200);
  const [completionGoldReward, setCompletionGoldReward] = useState(100);
  const [subtaskTitles, setSubtaskTitles] = useState(['']);

  const canSubmit = title.trim().length > 0;

  function updateSubtask(index: number, value: string) {
    setSubtaskTitles((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const subtasks = subtaskTitles
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ title: t, expReward: 20 }));

    addStoryQuest({
      title: title.trim(),
      description: description.trim(),
      attribute,
      completionExpReward,
      completionGoldReward,
      subtasks,
    });
    onClose();
  }

  return (
    <Modal title="Nuevo proyecto" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Título</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus placeholder="Ej. Lanzar mi proyecto personal" />
        </div>
        <div>
          <label className={labelClass}>Descripción (opcional)</label>
          <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Atributo principal</label>
          <div className="grid grid-cols-2 gap-2">
            {ATTRIBUTE_KEYS.map((key) => {
              const style = ATTRIBUTE_STYLE[key];
              const Icon = style.icon;
              const isActive = attribute === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setAttribute(key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    isActive ? `border-transparent ${style.soft} ${style.text}` : 'border-white/10 text-white/50 hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {ATTRIBUTE_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>EXP al completar</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={completionExpReward}
              onChange={(e) => setCompletionExpReward(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Oro al completar</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={completionGoldReward}
              onChange={(e) => setCompletionGoldReward(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Subtareas</label>
          <div className="space-y-2">
            {subtaskTitles.map((value, index) => (
              <input
                key={index}
                className={inputClass}
                placeholder={`Paso ${index + 1}`}
                value={value}
                onChange={(e) => updateSubtask(index, e.target.value)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSubtaskTitles((prev) => [...prev, ''])}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200"
          >
            <Plus size={14} /> Añadir paso
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancelar
          </button>
          <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
            Crear proyecto
          </button>
        </div>
      </form>
    </Modal>
  );
}
