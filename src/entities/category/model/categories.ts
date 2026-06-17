export const CATEGORIES = ['Все', 'Кафе', 'Рестораны', 'Спа'] as const;

export type Category = (typeof CATEGORIES)[number];
