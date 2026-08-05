import { useState } from 'react';
import { Coins, History, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Modal } from '../components/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '../components/formStyles';

const ICON_OPTIONS = ['🎬', '🍔', '🎮', '🛍️', '☕', '🎧', '📺', '🧘', '🍕', '💤', '🎨', '🚴'];

export function Shop() {
  const avatar = useGameStore((s) => s.avatar);
  const shopItems = useGameStore((s) => s.shopItems);
  const purchases = useGameStore((s) => s.purchases);
  const buyShopItem = useGameStore((s) => s.buyShopItem);
  const deleteShopItem = useGameStore((s) => s.deleteShopItem);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Tienda de recompensas</h1>
          <p className="flex items-center gap-1 text-sm text-yellow-300">
            <Coins size={14} /> {avatar.gold} de oro disponible
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Historial de compras"
          >
            <History size={18} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            <Plus size={16} />
            Recompensa
          </button>
        </div>
      </div>

      {shopItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
          No tienes recompensas configuradas. Crea una para poder canjear tu oro.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shopItems.map((item) => {
            const affordable = avatar.gold >= item.cost;
            return (
              <div key={item.id} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <button
                  onClick={() => deleteShopItem(item.id)}
                  className="absolute right-2 top-2 rounded-md p-1 text-white/20 hover:bg-white/10 hover:text-rose-300"
                  aria-label="Eliminar recompensa"
                >
                  <Trash2 size={13} />
                </button>
                <div className="text-3xl">{item.icon || '🎁'}</div>
                <p className="mt-2 text-sm font-semibold text-white">{item.name}</p>
                {item.description && <p className="mt-0.5 line-clamp-2 text-xs text-white/40">{item.description}</p>}
                <button
                  onClick={() => buyShopItem(item.id)}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    affordable
                      ? 'bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25'
                      : 'cursor-not-allowed bg-white/5 text-white/30'
                  }`}
                >
                  <Coins size={13} />
                  {item.cost}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <NewShopItemForm onClose={() => setShowForm(false)} />}
      {showHistory && <PurchaseHistoryModal purchases={purchases} onClose={() => setShowHistory(false)} />}
    </div>
  );
}

function NewShopItemForm({ onClose }: { onClose: () => void }) {
  const addShopItem = useGameStore((s) => s.addShopItem);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(100);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);

  const canSubmit = name.trim().length > 0 && cost > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    addShopItem({ name: name.trim(), description: description.trim(), cost, icon });
    onClose();
  }

  return (
    <Modal title="Nueva recompensa" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Nombre</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Ej. Ver una película" />
        </div>
        <div>
          <label className={labelClass}>Descripción (opcional)</label>
          <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Icono</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setIcon(opt)}
                className={`rounded-lg border px-2.5 py-1.5 text-lg ${
                  icon === opt ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/10 hover:bg-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Costo en oro</label>
          <input type="number" min={1} className={inputClass} value={cost} onChange={(e) => setCost(Number(e.target.value))} />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancelar
          </button>
          <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
            Crear recompensa
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PurchaseHistoryModal({
  purchases,
  onClose,
}: {
  purchases: { id: string; itemName: string; cost: number; purchasedAt: string }[];
  onClose: () => void;
}) {
  return (
    <Modal title="Historial de canjes" onClose={onClose}>
      {purchases.length === 0 ? (
        <p className="flex flex-col items-center gap-2 py-6 text-sm text-white/40">
          <ShoppingBag size={24} />
          Aún no has canjeado recompensas.
        </p>
      ) : (
        <div className="space-y-2">
          {purchases.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-white">{p.itemName}</p>
                <p className="text-xs text-white/40">{new Date(p.purchasedAt).toLocaleString('es-ES')}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-yellow-300">
                <Coins size={12} /> {p.cost}
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
