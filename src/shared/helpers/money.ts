export const formatMoney = (amount: number): string =>
  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сом';
