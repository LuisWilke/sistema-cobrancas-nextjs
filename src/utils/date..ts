export const parseDDMMYYYY = (str: string): Date => {
  const [day, month, year] = str.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
};