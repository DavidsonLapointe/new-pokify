
/**
 * Calculates the pro-rata value based on the plan's monthly price
 * and the remaining days in the current month
 */
export const calculateProRataValue = (planValue: number): number => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate();
  return parseFloat(((planValue / daysInMonth) * remainingDays).toFixed(2));
};

/**
 * Maps plan types to their respective monthly values
 */
export const getPlanValues = () => {
  return {
    basic: 99.90,
    professional: 199.90,
    enterprise: 399.90
  };
};
