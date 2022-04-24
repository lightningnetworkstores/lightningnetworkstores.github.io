
/**
 * @param {Date|string|number} date
 */
export function getWeeks(date) {
  let _date = date

  if (typeof date === "string" || !Number.isNaN(Number(date))) {
    _date = new Date(date)
  }

  if (!(_date instanceof Date)) {
    throw new TypeError("No valid date")
  }

  _date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  _date.setDate(_date.getDate() + 3 - (_date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(_date.getFullYear(), 0, 4);

  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((_date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
}