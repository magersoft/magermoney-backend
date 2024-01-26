export function filterBetweenDates(startDate: Date | undefined, endDate: Date | undefined) {
  return {
    gte: startDate ? new Date(startDate).toISOString() : undefined,
    lt: endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : undefined,
  };
}
