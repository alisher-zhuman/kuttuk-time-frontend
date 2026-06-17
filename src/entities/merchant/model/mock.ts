import type { Merchant } from './types';

export const MERCHANTS: Merchant[] = [
  { id: 'sierra',     name: 'Sierra Coffee',  category: 'Кофейни',       monogram: 'S', minAmount: 500  },
  { id: 'navat',      name: 'Navat',          category: 'Рестораны',     monogram: 'N', minAmount: 1000 },
  { id: 'faiza',      name: 'Faiza',          category: 'Рестораны',     monogram: 'F', minAmount: 700  },
  { id: 'pinta',      name: 'Pinta Burgers',  category: 'Рестораны',     monogram: 'P', minAmount: 500  },
  { id: 'spa',        name: 'Bellissimo Spa', category: 'Спа и красота', monogram: 'B', minAmount: 2000 },
  { id: 'cyclone',    name: 'Cyclone',        category: 'Фитнес',        monogram: 'C', minAmount: 1500 },
  { id: 'nebo',       name: 'Nebo Coffee',    category: 'Кофейни',       monogram: 'N', minAmount: 300  },
  { id: 'supara',     name: 'Supara',         category: 'Рестораны',     monogram: 'S', minAmount: 1500 },
  { id: 'cinderella', name: 'Cinderella',     category: 'Спа и красота', monogram: 'C', minAmount: 800  },
  { id: 'worldclass', name: 'World Class',    category: 'Фитнес',        monogram: 'W', minAmount: 3000 },
  { id: 'chicken',    name: 'Chicken Bench',  category: 'Рестораны',     monogram: 'C', minAmount: 400  },
  { id: 'kinopark',   name: 'Kinopark',       category: 'Развлечения',   monogram: 'K', minAmount: 300  },
];
