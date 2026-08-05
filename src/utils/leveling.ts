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

export function computeTitle(attributes: Attributes, level: number): string {
  if (level < 2) return 'Aventurero Novato';

  const entries = Object.entries(attributes) as [AttributeKey, number][];
  const max = Math.max(...entries.map(([, v]) => v));
  if (max < 10) return 'Aventurero';

  const leaders = entries.filter(([, v]) => v === max);
  if (leaders.length > 1) return 'Aventurero Equilibrado';

  return TITLES[leaders[0][0]];
}
