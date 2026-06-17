export const CATEGORIES = ['Все', 'Кофейни', 'Рестораны', 'Спа и красота', 'Фитнес', 'Развлечения'] as const;

export type Category = (typeof CATEGORIES)[number];
