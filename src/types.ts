export type AttributeKey = 'fuerza' | 'enfoque' | 'salud' | 'disciplina';

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  fuerza: 'Fuerza',
  enfoque: 'Enfoque',
  salud: 'Salud',
  disciplina: 'Disciplina',
};

export type Attributes = Record<AttributeKey, number>;

export interface Avatar {
  name: string;
  level: number;
  exp: number;
  gold: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
}

export interface DailyQuest {
  id: string;
  name: string;
  description: string;
  attribute: AttributeKey;
  expReward: number;
  goldReward: number;
  hpPenalty: number;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  lastCompletedDate: string | null;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  expReward: number;
}

export interface StoryQuest {
  id: string;
  title: string;
  description: string;
  attribute: AttributeKey;
  subtasks: Subtask[];
  completionExpReward: number;
  completionGoldReward: number;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  itemId: string;
  itemName: string;
  cost: number;
  purchasedAt: string;
}

export type NotificationType =
  | 'exp'
  | 'gold'
  | 'levelup'
  | 'penalty'
  | 'defeat'
  | 'info'
  | 'purchase';

export interface GameNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: number;
}
