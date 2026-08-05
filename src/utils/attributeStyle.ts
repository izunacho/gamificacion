import { Dumbbell, Brain, HeartPulse, ShieldCheck } from 'lucide-react';
import type { AttributeKey } from '../types';

export const ATTRIBUTE_STYLE: Record<
  AttributeKey,
  { icon: typeof Dumbbell; text: string; bar: string; soft: string }
> = {
  fuerza: { icon: Dumbbell, text: 'text-orange-400', bar: 'bg-orange-500', soft: 'bg-orange-500/15' },
  enfoque: { icon: Brain, text: 'text-sky-400', bar: 'bg-sky-500', soft: 'bg-sky-500/15' },
  salud: { icon: HeartPulse, text: 'text-emerald-400', bar: 'bg-emerald-500', soft: 'bg-emerald-500/15' },
  disciplina: { icon: ShieldCheck, text: 'text-violet-400', bar: 'bg-violet-500', soft: 'bg-violet-500/15' },
};
