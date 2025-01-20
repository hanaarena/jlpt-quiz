export function formatYearDate(date) {
  const today = new Date(date);
  return new Intl.DateTimeFormat('en-CA').format(today);
}

