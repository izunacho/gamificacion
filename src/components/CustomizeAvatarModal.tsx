import { useState } from 'react';
import { Modal } from './Modal';
import { AvatarViewer } from '../three/AvatarViewer';
import { useGameStore } from '../store/useGameStore';
import { getDominantKey } from '../utils/leveling';
import { HAIR_COLOR_OPTIONS, OUTFIT_COLOR_OPTIONS, SKIN_TONE_OPTIONS } from '../utils/appearance';
import { primaryButtonClass, secondaryButtonClass } from './formStyles';

function Swatches({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-white/60">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-full ring-2 transition ${
              value === color ? 'ring-white scale-110' : 'ring-white/10 hover:ring-white/40'
            }`}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
}

export function CustomizeAvatarModal({ onClose }: { onClose: () => void }) {
  const avatar = useGameStore((s) => s.avatar);
  const updateAppearance = useGameStore((s) => s.updateAppearance);
  const [draft, setDraft] = useState(avatar.appearance);

  const dominantAttribute = getDominantKey(avatar.attributes, avatar.level);

  function handleSave() {
    updateAppearance(draft);
    onClose();
  }

  return (
    <Modal title="Personalizar personaje" onClose={onClose}>
      <div className="mb-3 h-56 overflow-hidden rounded-xl bg-slate-950/60">
        <AvatarViewer appearance={draft} level={avatar.level} dominantAttribute={dominantAttribute} className="h-full w-full" />
      </div>

      <div className="space-y-4">
        <Swatches
          label="Tono de piel"
          options={SKIN_TONE_OPTIONS}
          value={draft.skinColor}
          onChange={(skinColor) => setDraft((d) => ({ ...d, skinColor }))}
        />
        <Swatches
          label="Color de cabello"
          options={HAIR_COLOR_OPTIONS}
          value={draft.hairColor}
          onChange={(hairColor) => setDraft((d) => ({ ...d, hairColor }))}
        />
        <Swatches
          label="Color de atuendo"
          options={OUTFIT_COLOR_OPTIONS}
          value={draft.outfitColor}
          onChange={(outfitColor) => setDraft((d) => ({ ...d, outfitColor }))}
        />
      </div>

      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Cancelar
        </button>
        <button type="button" onClick={handleSave} className={primaryButtonClass}>
          Guardar
        </button>
      </div>
    </Modal>
  );
}
