const FILTER_KEYS = ['provas', 'materias', 'bancas', 'assuntos', 'professor', 'tipos'];

function splitValues(value) {
    if (!value) {
        return [];
    }

    return value
        .split(';')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

function normalizePage(value, fallback = 1) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export function getPageFromSearchParams(searchParams, fallback = 1) {
    return normalizePage(searchParams.get('page'), fallback);
}

export function getFiltersFromSearchParams(searchParams) {
    const filters = {};

    FILTER_KEYS.forEach((key) => {
        filters[key] = splitValues(searchParams.get(key));
    });

    return filters;
}

export function clearFilterParams(searchParams) {
    const next = new URLSearchParams(searchParams);

    FILTER_KEYS.forEach((key) => next.delete(key));

    return next;
}

export function mergeFiltersIntoSearchParams(searchParams, filters) {
    const next = clearFilterParams(searchParams);

    FILTER_KEYS.forEach((key) => {
        const values = filters?.[key] || [];

        if (values.length > 0) {
            next.set(key, values.join(';'));
        }
    });

    return next;
}

export function buildApiFilterQuery(filters) {
    const params = new URLSearchParams();

    FILTER_KEYS.forEach((key) => {
        const values = filters?.[key] || [];

        if (values.length > 0) {
            params.set(key, values.join(';'));
        }
    });

    const query = params.toString();
    return query ? `&${query}` : '';
}

export function filtersToSelectOptions(values = []) {
    return values.map((value) => ({
        value,
        label: value,
    }));
}

export function getCurrentUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}

export function decodeReturnTo(value, fallback) {
    if (!value) {
        return fallback;
    }

    try {
        const decoded = decodeURIComponent(value);
        return decoded.startsWith('/') ? decoded : fallback;
    }
    catch {
        return fallback;
    }
}

