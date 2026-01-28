/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if we need to reset daily spins
 */
export const shouldResetSpins = (lastSpinDate: string): boolean => {
  return lastSpinDate !== getTodayDateString();
};
