export function formatYearDate(date:  number | string | Date) {
  const today = new Date(date);
  return new Intl.DateTimeFormat('en-CA').format(today);
}

