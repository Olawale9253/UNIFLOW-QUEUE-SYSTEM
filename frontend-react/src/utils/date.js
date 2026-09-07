export const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value, fallback = 'Date unavailable') => {
    const date = parseDate(value);
    return date ? date.toLocaleString() : fallback;
};

export const dateTimestamp = (value) => parseDate(value)?.getTime() || 0;