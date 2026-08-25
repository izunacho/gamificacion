import type { Attributes, AttributeKey } from '../types';

/**
 * Curva de dificultad progresiva: cada nivel exige más EXP que el anterior
 * siguiendo un crecimiento exponencial suave (RPG clásico).
 */
export function expToNextLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.5) + 50);
}

export function attributeGainFor(expReward: number): number {
  return Math.max(1, Math.round(expReward / 10));
}

const TITLES: Record<AttributeKey, string> = {
  fuerza: 'Atleta',
  enfoque: 'Estudiante',
  salud: 'Sanador',
  disciplina: 'Monje',
};

export type DominantKey = AttributeKey | 'balanced' | 'novice';

/**
 * Same rule used for the title and for the 3D avatar's class accessory:
 * whichever attribute is clearly ahead of the rest, once the character has
 * leveled up enough and trained it enough to count.
 */
export function getDominantKey(attributes: Attributes, level: number): DominantKey {
  if (level < 2) return 'novice';

  const entries = Object.entries(attributes) as [AttributeKey, number][];
  const max = Math.max(...entries.map(([, v]) => v));
  if (max < 10) return 'novice';

  const leaders = entries.filter(([, v]) => v === max);
  if (leaders.length > 1) return 'balanced';

  return leaders[0][0];
}

export function computeTitle(attributes: Attributes, level: number): string {
  const dominant = getDominantKey(attributes, level);
  if (dominant === 'novice') return level < 2 ? 'Aventurero Novato' : 'Aventurero';
  if (dominant === 'balanced') return 'Aventurero Equilibrado';
  return TITLES[dominant];
}
