import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Attributes,
  AttributeKey,
  Avatar,
  DailyQuest,
  GameNotification,
  NotificationType,
  Purchase,
  ShopItem,
  StoryQuest,
  Subtask,
} from '../types';
import { attributeGainFor, expToNextLevel } from '../utils/leveling';
import { todayStr } from '../utils/date';

const STREAK_BONUS_INTERVAL = 7;
const STREAK_BONUS_GOLD = 50;
const DEFEAT_GOLD_LOSS_RATIO = 0.1;
const DEFEAT_HP_RECOVERY_RATIO = 0.5;

function newId(): string {
  return crypto.randomUUID();
}

function emptyAttributes(): Attributes {
  return { fuerza: 0, enfoque: 0, salud: 0, disciplina: 0 };
}

function initialAvatar(): Avatar {
  return {
    name: 'Héroe',
    level: 1,
    exp: 0,
    gold: 50,
    hp: 100,
    maxHp: 100,
    attributes: emptyAttributes(),
  };
}

function seedDailyQuests(): DailyQuest[] {
  const base = {
    streak: 0,
    bestStreak: 0,
    completedToday: false,
    lastCompletedDate: null,
    createdAt: new Date().toISOString(),
  };
  return [
    {
      id: newId(),
      name: 'Hacer 20 min de ejercicio',
      description: 'Cualquier actividad física: gimnasio, correr, caminar rápido.',
      attribute: 'fuerza',
      expReward: 50,
      goldReward: 10,
      hpPenalty: 10,
      ...base,
    },
    {
      id: newId(),
      name: 'Leer o estudiar 30 min',
      description: 'Lectura, curso o práctica enfocada.',
      attribute: 'enfoque',
      expReward: 40,
      goldReward: 8,
      hpPenalty: 5,
      ...base,
    },
    {
      id: newId(),
      name: 'Dormir 7+ horas',
      description: 'Descanso de calidad para recuperar energía.',
      attribute: 'salud',
      expReward: 30,
      goldReward: 5,
      hpPenalty: 15,
      ...base,
    },
    {
      id: newId(),
      name: 'Planificar el día',
      description: 'Revisar objetivos y organizar tareas antes de empezar.',
      attribute: 'disciplina',
      expReward: 20,
      goldReward: 5,
      hpPenalty: 5,
      ...base,
    },
  ];
}

function seedStoryQuests(): StoryQuest[] {
  return [
    {
      id: newId(),
      title: 'Lanzar mi proyecto personal',
      description: 'Divide el proyecto grande en pasos concretos y cóbralos uno a uno.',
      attribute: 'disciplina',
      subtasks: [
        { id: newId(), title: 'Definir el alcance', done: false, expReward: 30 },
        { id: newId(), title: 'Crear un plan de 4 semanas', done: false, expReward: 30 },
        { id: newId(), title: 'Completar la primera semana', done: false, expReward: 40 },
      ],
      completionExpReward: 200,
      completionGoldReward: 100,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    },
  ];
}

function seedShopItems(): ShopItem[] {
  return [
    { id: newId(), name: 'Ver una película', description: 'Noche de descanso sin culpa.', cost: 200, icon: '🎬', createdAt: new Date().toISOString() },
    { id: newId(), name: 'Comida favorita', description: 'Date un gusto.', cost: 150, icon: '🍔', createdAt: new Date().toISOString() },
    { id: newId(), name: 'Sesión de videojuegos (1h)', description: 'Diversión sin remordimientos.', cost: 100, icon: '🎮', createdAt: new Date().toISOString() },
  ];
}

interface GameState {
  avatar: Avatar;
  dailyQuests: DailyQuest[];
  storyQuests: StoryQuest[];
  shopItems: ShopItem[];
  purchases: Purchase[];
  notifications: GameNotification[];
  lastProcessedDate: string;

  notify: (type: NotificationType, title: string, message: string) => void;
  dismissNotification: (id: string) => void;

  gainExp: (amount: number, attribute?: AttributeKey) => void;
  applyPenalty: (amount: number) => void;

  processDailyReset: () => void;

  completeDailyQuest: (id: string) => void;
  addDailyQuest: (input: {
    name: string;
    description: string;
    attribute: AttributeKey;
    expReward: number;
    goldReward: number;
    hpPenalty: number;
  }) => void;
  deleteDailyQuest: (id: string) => void;

  addStoryQuest: (input: {
    title: string;
    description: string;
    attribute: AttributeKey;
    completionExpReward: number;
    completionGoldReward: number;
    subtasks: { title: string; expReward: number }[];
  }) => void;
  deleteStoryQuest: (id: string) => void;
  toggleSubtask: (questId: string, subtaskId: string) => void;
  addSubtask: (questId: string, title: string, expReward: number) => void;
  deleteSubtask: (questId: string, subtaskId: string) => void;

  addShopItem: (input: { name: string; description: string; cost: number; icon: string }) => void;
  deleteShopItem: (id: string) => void;
  buyShopItem: (id: string) => void;

  updateAvatarName: (name: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      avatar: initialAvatar(),
      dailyQuests: seedDailyQuests(),
      storyQuests: seedStoryQuests(),
      shopItems: seedShopItems(),
      purchases: [],
      notifications: [],
      lastProcessedDate: todayStr(),

      notify: (type, title, message) => {
        const notification: GameNotification = {
          id: newId(),
          type,
          title,
          message,
          createdAt: Date.now(),
        };
        set((state) => ({ notifications: [...state.notifications, notification] }));
      },

      dismissNotification: (id) => {
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
      },

      gainExp: (amount, attribute) => {
        const current = get().avatar;
        const avatar = { ...current, attributes: { ...current.attributes } };
        avatar.exp += amount;
        if (attribute) {
          avatar.attributes[attribute] += attributeGainFor(amount);
        }

        let leveledUp = false;
        let threshold = expToNextLevel(avatar.level);
        while (avatar.exp >= threshold) {
          avatar.exp -= threshold;
          avatar.level += 1;
          avatar.maxHp += 10;
          avatar.hp = avatar.maxHp;
          leveledUp = true;
          threshold = expToNextLevel(avatar.level);
        }

        set({ avatar });

        if (leveledUp) {
          get().notify('levelup', '¡Subiste de nivel!', `Ahora eres nivel ${avatar.level}. Vida restaurada.`);
        }
      },

      applyPenalty: (amount) => {
        const current = get().avatar;
        const avatar = { ...current };
        avatar.hp = Math.max(0, avatar.hp - amount);

        let defeated = false;
        let goldLoss = 0;
        if (avatar.hp === 0) {
          defeated = true;
          goldLoss = Math.round(avatar.gold * DEFEAT_GOLD_LOSS_RATIO);
          avatar.gold = Math.max(0, avatar.gold - goldLoss);
          avatar.hp = Math.round(avatar.maxHp * DEFEAT_HP_RECOVERY_RATIO);
        }

        set({ avatar });

        if (defeated) {
          get().notify(
            'defeat',
            'Derrota',
            `Tu vida llegó a 0 por hábitos incumplidos. Perdiste ${goldLoss} de oro y te recuperas con ${avatar.hp} HP.`,
          );
        }
      },

      processDailyReset: () => {
        const today = todayStr();
        const state = get();
        if (state.lastProcessedDate === today) return;

        let missedCount = 0;
        const dailyQuests = state.dailyQuests.map((q) => {
          if (!q.completedToday) {
            missedCount += 1;
            return { ...q, streak: 0, completedToday: false };
          }
          return { ...q, completedToday: false };
        });

        set({ dailyQuests, lastProcessedDate: today });

        if (missedCount > 0) {
          const missedQuests = state.dailyQuests.filter((q) => !q.completedToday);
          const totalPenalty = missedQuests.reduce((sum, q) => sum + q.hpPenalty, 0);
          if (totalPenalty > 0) {
            get().applyPenalty(totalPenalty);
          }
          get().notify(
            'penalty',
            'Misiones incumplidas',
            `Ayer no completaste ${missedCount} misión(es) diaria(s). Perdiste ${totalPenalty} de vida.`,
          );
        }
      },

      completeDailyQuest: (id) => {
        const state = get();
        const quest = state.dailyQuests.find((q) => q.id === id);
        if (!quest || quest.completedToday) return;
        const today = todayStr();

        const newStreak = quest.streak + 1;
        set((s) => ({
          dailyQuests: s.dailyQuests.map((q) =>
            q.id === id
              ? {
                  ...q,
                  completedToday: true,
                  lastCompletedDate: today,
                  streak: newStreak,
                  bestStreak: Math.max(q.bestStreak, newStreak),
                }
              : q,
          ),
        }));

        get().gainExp(quest.expReward, quest.attribute);
        set((s) => ({ avatar: { ...s.avatar, gold: s.avatar.gold + quest.goldReward } }));
        get().notify('exp', quest.name, `+${quest.expReward} EXP · +${quest.goldReward} oro`);

        if (newStreak > 0 && newStreak % STREAK_BONUS_INTERVAL === 0) {
          set((s) => ({ avatar: { ...s.avatar, gold: s.avatar.gold + STREAK_BONUS_GOLD } }));
          get().notify(
            'gold',
            `¡Racha de ${newStreak} días!`,
            `Bono de racha: +${STREAK_BONUS_GOLD} oro en "${quest.name}"`,
          );
        }
      },

      addDailyQuest: (input) => {
        const quest: DailyQuest = {
          id: newId(),
          ...input,
          streak: 0,
          bestStreak: 0,
          completedToday: false,
          lastCompletedDate: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ dailyQuests: [...state.dailyQuests, quest] }));
      },

      deleteDailyQuest: (id) => {
        set((state) => ({ dailyQuests: state.dailyQuests.filter((q) => q.id !== id) }));
      },

      addStoryQuest: (input) => {
        const quest: StoryQuest = {
          id: newId(),
          title: input.title,
          description: input.description,
          attribute: input.attribute,
          completionExpReward: input.completionExpReward,
          completionGoldReward: input.completionGoldReward,
          subtasks: input.subtasks.map((s) => ({ id: newId(), title: s.title, done: false, expReward: s.expReward })),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        set((state) => ({ storyQuests: [...state.storyQuests, quest] }));
      },

      deleteStoryQuest: (id) => {
        set((state) => ({ storyQuests: state.storyQuests.filter((q) => q.id !== id) }));
      },

      toggleSubtask: (questId, subtaskId) => {
        const state = get();
        const quest = state.storyQuests.find((q) => q.id === questId);
        if (!quest || quest.completed) return;
        const subtask = quest.subtasks.find((s) => s.id === subtaskId);
        if (!subtask) return;

        const nowDone = !subtask.done;
        set((s) => ({
          storyQuests: s.storyQuests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  subtasks: q.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: nowDone } : st)),
                }
              : q,
          ),
        }));

        if (nowDone) {
          get().gainExp(subtask.expReward, quest.attribute);
          get().notify('exp', subtask.title, `+${subtask.expReward} EXP`);
        }

        const updatedQuest = get().storyQuests.find((q) => q.id === questId);
        if (updatedQuest && updatedQuest.subtasks.length > 0 && updatedQuest.subtasks.every((s) => s.done)) {
          set((s) => ({
            storyQuests: s.storyQuests.map((q) =>
              q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q,
            ),
            avatar: { ...s.avatar, gold: s.avatar.gold + updatedQuest.completionGoldReward },
          }));
          get().gainExp(updatedQuest.completionExpReward, updatedQuest.attribute);
          get().notify(
            'levelup',
            `¡Misión completada: ${updatedQuest.title}!`,
            `+${updatedQuest.completionExpReward} EXP · +${updatedQuest.completionGoldReward} oro`,
          );
        }
      },

      addSubtask: (questId, title, expReward) => {
        const subtask: Subtask = { id: newId(), title, done: false, expReward };
        set((state) => ({
          storyQuests: state.storyQuests.map((q) =>
            q.id === questId ? { ...q, subtasks: [...q.subtasks, subtask] } : q,
          ),
        }));
      },

      deleteSubtask: (questId, subtaskId) => {
        set((state) => ({
          storyQuests: state.storyQuests.map((q) =>
            q.id === questId ? { ...q, subtasks: q.subtasks.filter((s) => s.id !== subtaskId) } : q,
          ),
        }));
      },

      addShopItem: (input) => {
        const item: ShopItem = { id: newId(), ...input, createdAt: new Date().toISOString() };
        set((state) => ({ shopItems: [...state.shopItems, item] }));
      },

      deleteShopItem: (id) => {
        set((state) => ({ shopItems: state.shopItems.filter((i) => i.id !== id) }));
      },

      buyShopItem: (id) => {
        const state = get();
        const item = state.shopItems.find((i) => i.id === id);
        if (!item) return;

        if (state.avatar.gold < item.cost) {
          get().notify('info', 'Oro insuficiente', `Necesitas ${item.cost - state.avatar.gold} de oro más para "${item.name}".`);
          return;
        }

        const purchase: Purchase = {
          id: newId(),
          itemId: item.id,
          itemName: item.name,
          cost: item.cost,
          purchasedAt: new Date().toISOString(),
        };

        set((s) => ({
          avatar: { ...s.avatar, gold: s.avatar.gold - item.cost },
          purchases: [purchase, ...s.purchases],
        }));
        get().notify('purchase', '¡Recompensa canjeada!', `Disfruta: ${item.name}`);
      },

      updateAvatarName: (name) => {
        set((state) => ({ avatar: { ...state.avatar, name } }));
      },
    }),
    {
      name: 'lifequest-storage',
      partialize: (state) => ({
        avatar: state.avatar,
        dailyQuests: state.dailyQuests,
        storyQuests: state.storyQuests,
        shopItems: state.shopItems,
        purchases: state.purchases,
        lastProcessedDate: state.lastProcessedDate,
      }),
    },
  ),
);
