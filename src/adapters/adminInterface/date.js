const oneDay = 1000 * 60 * 60 * 24;



/**
 * Converts a number representing a date to its corresponding text format.
 *
 * @param  {number} dayNumber - The number representing the day in the format 'YYDDD'.
 * @return {string | undefined} - The converted date in text format, or undefined if the input is invalid.
 */
export function dateNumberToText(dayNumber) {
  const dayNumberAsString = dayNumber.toString();
  if ( dayNumberAsString.length !== 5 ) return;
  const day    = parseInt(dayNumberAsString.slice(2));
  const year   = parseInt(dayNumberAsString.slice(0, 2)) + 2000;
  const date   = new Date(year, 0);
  date.setDate(day);
  return date
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
}

export function getDate() {
  const today     = new Date();
  const year      = today.getFullYear();
  const yearStart = new Date(year, 0, 1);
  return (year % 100) * 1000 + Math.ceil((today - yearStart) / oneDay);
}