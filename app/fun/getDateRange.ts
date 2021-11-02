export function getDateRange() {
  const eod = new Date();
  const bod = new Date(eod.getFullYear(), eod.getMonth(), eod.getDate());
  return { bod, eod };
}
