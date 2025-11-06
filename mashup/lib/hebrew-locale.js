/**
 * Hebrew Locale Utilities
 * Formatting functions for Hebrew locale (he-IL)
 * Handles numbers, percentages, dates, and RTL text
 */

/**
 * Format number with Hebrew locale (thousands separator)
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 *
 * @example
 * formatNumber(123456) → "123,456"
 * formatNumber(123456.789, 2) → "123,456.79"
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  return value.toLocaleString('he-IL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format percentage with Hebrew locale
 * @param {number} value - Decimal value (0.15 = 15%)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 *
 * @example
 * formatPercentage(0.153) → "15.3%"
 * formatPercentage(0.153, 0) → "15%"
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--%';
  }

  return (value * 100).toLocaleString('he-IL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + '%';
}

/**
 * Format large numbers with compact notation (K, M, B)
 * Hebrew: אלף (K), מיליון (M), מיליארד (B)
 * @param {number} value - Number to format
 * @returns {string} Formatted compact number
 *
 * @example
 * formatCompactNumber(1500) → "1.5K"
 * formatCompactNumber(1500000) → "1.5M"
 */
export function formatCompactNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  if (value < 1000) {
    return formatNumber(value);
  }

  const suffixes = [
    { value: 1e9, suffix: 'B' },   // Billion
    { value: 1e6, suffix: 'M' },   // Million
    { value: 1e3, suffix: 'K' }    // Thousand
  ];

  for (const { value: threshold, suffix } of suffixes) {
    if (value >= threshold) {
      return (value / threshold).toLocaleString('he-IL', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }) + suffix;
    }
  }

  return formatNumber(value);
}

/**
 * Format date with Hebrew locale
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long' (default: 'short')
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate(new Date('2025-11-07'), 'short') → "7.11.2025"
 * formatDate(new Date('2025-11-07'), 'medium') → "7 בנוב׳ 2025"
 * formatDate(new Date('2025-11-07'), 'long') → "7 בנובמבר 2025"
 */
export function formatDate(date, format = 'short') {
  if (!date) {
    return '--';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '--';
  }

  const options = {
    short: { day: 'numeric', month: 'numeric', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' }
  };

  return dateObj.toLocaleDateString('he-IL', options[format] || options.short);
}

/**
 * Format month name in Hebrew
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Hebrew month name
 *
 * @example
 * formatMonthName(1) → "ינואר"
 * formatMonthName(11) → "נובמבר"
 */
export function formatMonthName(monthNumber) {
  const hebrewMonths = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  if (monthNumber < 1 || monthNumber > 12) {
    return '--';
  }

  return hebrewMonths[monthNumber - 1];
}

/**
 * Format currency (ILS - Israeli Shekel)
 * @param {number} value - Amount to format
 * @param {boolean} showSymbol - Whether to show ₪ symbol (default: true)
 * @returns {string} Formatted currency string
 *
 * @example
 * formatCurrency(12345) → "₪12,345"
 * formatCurrency(12345.67) → "₪12,345.67"
 * formatCurrency(12345, false) → "12,345"
 */
export function formatCurrency(value, showSymbol = true) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  const formatted = value.toLocaleString('he-IL', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });

  return showSymbol ? '₪' + formatted : formatted;
}

/**
 * Format duration (for time-based metrics)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 *
 * @example
 * formatDuration(65) → "1 דקה 5 שניות"
 * formatDuration(3665) → "1 שעה 1 דקה"
 */
export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return '--';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'שעה' : 'שעות'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'דקה' : 'דקות'}`);
  }
  if (secs > 0 && hours === 0) {
    parts.push(`${secs} ${secs === 1 ? 'שנייה' : 'שניות'}`);
  }

  return parts.join(' ') || '0 שניות';
}

/**
 * Get RTL direction marker
 * Useful for forcing RTL direction in mixed content
 * @returns {string} RTL mark character
 */
export function getRtlMark() {
  return '\u200F';  // Right-to-Left Mark (RLM)
}

/**
 * Wrap text with RTL marks for proper display
 * @param {string} text - Text to wrap
 * @returns {string} Text wrapped with RTL marks
 */
export function wrapRtl(text) {
  return getRtlMark() + text + getRtlMark();
}

/**
 * Format Qlik hypercube cell value
 * Handles both text and numeric values from Qlik
 * @param {Object} cell - Qlik hypercube cell object
 * @param {string} formatType - Format type: 'number', 'percentage', 'currency'
 * @returns {string} Formatted cell value
 */
export function formatQlikCell(cell, formatType = 'number') {
  if (!cell) {
    return '--';
  }

  // Use Qlik's formatted text if available
  if (cell.qText !== undefined && cell.qText !== '') {
    return cell.qText;
  }

  // Otherwise format the numeric value
  const value = cell.qNum;

  switch (formatType) {
    case 'percentage':
      return formatPercentage(value);
    case 'currency':
      return formatCurrency(value);
    case 'compact':
      return formatCompactNumber(value);
    default:
      return formatNumber(value);
  }
}

/**
 * Pluralize Hebrew text based on count
 * @param {number} count - Count value
 * @param {string} singular - Singular form (e.g., "רכב")
 * @param {string} plural - Plural form (e.g., "רכבים")
 * @returns {string} Pluralized text
 *
 * @example
 * pluralize(1, 'רכב', 'רכבים') → "רכב אחד"
 * pluralize(5, 'רכב', 'רכבים') → "5 רכבים"
 */
export function pluralize(count, singular, plural) {
  if (count === 1) {
    return `${singular} אחד`;
  } else if (count === 2) {
    return `שני ${plural}`;
  } else {
    return `${formatNumber(count)} ${plural}`;
  }
}

/**
 * Get current timestamp formatted for Hebrew locale
 * @returns {string} Formatted timestamp
 *
 * @example
 * getCurrentTimestamp() → "7.11.2025, 14:30"
 */
export function getCurrentTimestamp() {
  return new Date().toLocaleString('he-IL', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format relative time (e.g., "לפני 5 דקות")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000)) → "לפני 5 דקות"
 */
export function formatRelativeTime(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'כרגע';
  } else if (diffMins < 60) {
    return `לפני ${diffMins} ${diffMins === 1 ? 'דקה' : 'דקות'}`;
  } else if (diffHours < 24) {
    return `לפני ${diffHours} ${diffHours === 1 ? 'שעה' : 'שעות'}`;
  } else if (diffDays < 7) {
    return `לפני ${diffDays} ${diffDays === 1 ? 'יום' : 'ימים'}`;
  } else {
    return formatDate(dateObj, 'medium');
  }
}
