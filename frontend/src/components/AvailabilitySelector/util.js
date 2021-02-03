// format a numeric hour as a 12-hour time
export const formatHour = h => {
  if (h === 0 || h === 24) {
    return "12am";
  }
  if (h < 12) {
    return `${h}am`;
  }
  if (h === 12) {
    return `noon`;
  }
  return `${h-12}pm`;
};

// convert a range [min, max] to a YYNN string, or return null
// if the range cannot be represented that way (min == max)
export const rangeToYN = ([a, b]) => {
  if (a === b) {
    return null; // disallowed
  }
  return ('N'.repeat(a) + 'Y'.repeat(b-a)).padEnd(24, 'N');
}

// convert the given YYNN string into a range, if possible
export const ynToRange = yn => {
  const match = yn.match(/^(N*)(Y+)N*$/);
  if (match) {
    return [match[1].length, match[1].length + match[2].length];
  }
  return null;
};

let TZ_OFFSET_POSITIVE_HOURS = (Math.floor(new Date().getTimezoneOffset() / 60) + 24) % 24;
export const set_TZ_OFFSET_POSITIVE_HOURS = h => TZ_OFFSET_POSITIVE_HOURS = h;

// Convert a YYNN string from UTC to the user's local timezone.
// This ignores any additional minutes on non-hour-offset timezones.
// That's OK -- this control is just selecting time ranges.
export const utcToLocal = utc => {
  return utc.slice(TZ_OFFSET_POSITIVE_HOURS, 24) + utc.slice(0, TZ_OFFSET_POSITIVE_HOURS);
};

// The reverse
export const localToUtc = utc => {
  return utc.slice(24 - TZ_OFFSET_POSITIVE_HOURS, 24) + utc.slice(0, 24 - TZ_OFFSET_POSITIVE_HOURS);
};
