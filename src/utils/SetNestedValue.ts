export function getScormValue(rootData: any, path: string): string {
    if (!path.startsWith('cmi.')) {
        console.warn(`[ScormObjectParser] Invalid key prefix: ${path}`);
        return "";
    }

    const segments = path.substring(4).split('.');

    let current = rootData;

    for (const key of segments) {
        if (current === undefined || current === null) {
            return "";
        }
        current = current[key];
    }

    if (current === undefined || current === null) {
        return "";
    }

    return String(current);
}

export function setScormValue<T>(rootData: T, path: string, value: string): T {
    if (!path.startsWith('cmi.')) return rootData;

    const segments = path.substring(4).split('.');
    const newRoot = { ...rootData };

    let current: any = newRoot;

    for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i];

        if (!current[key]) {
            const nextKeyIsIndex = !isNaN(Number(segments[i + 1]));
            current[key] = nextKeyIsIndex ? [] : {};
        }

        current[key] = Array.isArray(current[key])
            ? [...current[key]]
            : { ...current[key] };

        current = current[key];
    }

    const lastKey = segments[segments.length - 1];
    current[lastKey] = value;

    return newRoot;
}