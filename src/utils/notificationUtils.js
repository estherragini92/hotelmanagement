export const getLatestItems = (items, limit = 10) => {
  return [...items]
    .sort((a, b) => Number(b.rawId || b.id || 0) - Number(a.rawId || a.id || 0))
    .slice(0, limit);
};