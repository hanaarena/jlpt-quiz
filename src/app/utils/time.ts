export function formatYearDate(date:  number | string | Date) {
  const today = new Date(date);
  return new Intl.DateTimeFormat('en-CA').format(today);
}

// format time to mm:ss.ms
export const formatHMS = (start: number | null): string => {
  if (!start) return "00:00.00";
  const elapsed = Date.now() - start;
  const totalSeconds = Math.floor(elapsed / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  // Get hundredths of a second (e.g., 1530ms -> 53)
  const hundredths = Math.floor((elapsed % 1000) / 10);

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  const paddedHundredths = String(hundredths).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}.${paddedHundredths}`;
};
