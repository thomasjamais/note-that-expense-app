export const getNumberOfDaysInRange = (
  range: string,
  tripStartDate: Date,
  start?: Date,
  end?: Date,
): number => {
  return start && end
    ? Math.ceil((new Date(start).getTime() - new Date(end).getTime()) / (1000 * 3600 * 24)) + 1
    : range === 'week'
      ? 7
      : range === 'month'
        ? new Date().getDate()
        : range === 'total'
          ? tripStartDate
            ? Math.ceil(
                (new Date().getTime() - new Date(tripStartDate).getTime()) / (1000 * 3600 * 24),
              )
            : 0
          : 0;
};
