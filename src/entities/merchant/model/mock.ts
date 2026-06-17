import type { Merchant } from './types';

export const MERCHANTS: Merchant[] = [
  { id: 'sierra',  name: 'Sierra Coffee',  category: 'Кофейня',            gradient: 'v1', monogram: 'S', minAmount: 500  },
  { id: 'navat',   name: 'Navat',          category: 'Ресторан',           gradient: 'v2', monogram: 'N', minAmount: 1000 },
  { id: 'faiza',   name: 'Faiza',          category: 'Национальная кухня', gradient: 'v3', monogram: 'F', minAmount: 700  },
  { id: 'pinta',   name: 'Pinta Burgers',  category: 'Бургеры',            gradient: 'v4', monogram: 'P', minAmount: 500  },
  { id: 'spa',     name: 'Bellissimo Spa', category: 'Спа и красота',      gradient: 'v5', monogram: 'B', minAmount: 2000 },
  { id: 'cyclone', name: 'Cyclone',        category: 'Фитнес',             gradient: 'v6', monogram: 'C', minAmount: 1500 },
];
