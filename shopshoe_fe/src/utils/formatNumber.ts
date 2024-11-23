export const formatNumber = (val: number) => {
  return new Intl.NumberFormat("de-DE").format(val);
};
