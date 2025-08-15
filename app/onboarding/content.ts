export const slides = [
  {
    key: 'track',
    title: 'Note tes dépenses en 2 cliques',
    subtitle: 'Hors-ligne, multidevises, catégories colorées.',
    artType: 'lottie' as const,
    getSource: async () => {
      const mod = await import('../../assets/onboarding/track.json');
      return (mod as any).default ?? mod;
    },
  },
  {
    key: 'budget',
    title: 'Pilote ton budget',
    subtitle: 'Budget total ou mensuel, progression claire, alertes.',
    artType: 'lottie' as const,
    getSource: async () => {
      const mod = await import('../../assets/onboarding/budget.json');
      return (mod as any).default ?? mod;
    },
  },
  {
    key: 'insights',
    title: 'Comprends tes dépenses',
    subtitle: 'Graphiques interactifs, top catégories, tendances.',
    artType: 'lottie' as const,
    getSource: async () => {
      const mod = await import('../../assets/onboarding/insights.json');
      return (mod as any).default ?? mod;
    },
  },
];
