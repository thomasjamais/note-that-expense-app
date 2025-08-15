import TrackSvg from '../../assets/onboarding/onboarding-1-track.svg';
import BudgetSvg from '../../assets/onboarding/onboarding-2-budget.svg';
import InsightsSvg from '../../assets/onboarding/onboarding-3-insights.svg';

export const slides = [
  {
    key: 'track',
    title: 'Note tes dépenses en 2 cliques',
    subtitle: 'Hors-ligne, multidevises, catégories colorées.',
    artType: 'svg' as const,
    artComponent: TrackSvg,
  },
  {
    key: 'budget',
    title: 'Pilote ton budget',
    subtitle: 'Budget total ou mensuel, progression claire, alertes.',
    artType: 'svg' as const,
    artComponent: BudgetSvg,
    // Si tu veux utiliser une image Lottie, tu peux faire comme ça :
    // artType: 'lottie' as const,
    // getSource: async () => {
    //   const mod = await import('../../assets/onboarding/onboarding-budget.json');
    //   return (mod as any).default ?? mod;
    // },
    // fallback: { type: 'svg', Comp: BudgetSvg },
  },
  {
    key: 'insights',
    title: 'Comprends tes dépenses',
    subtitle: 'Graphiques interactifs, top catégories, tendances.',
    artType: 'svg' as const,
    artComponent: InsightsSvg,
  },
];
