export function isDuplicate(origin, assumption, toExclude = []) {
    return Object.entries(origin)
        .filter((key) => toExclude.includes(key))
        .every(([key, value]) => assumption[key] === value);
}

export function objectToHash(obj: object, toPick: string[]) {
    const sortedEntries = Object.entries(obj)
        .filter(([key]) => toPick.includes(key))
        .sort(([key1], [key2]) => key1 < key2 ? -1 : 1);
    return JSON.stringify(entriesToObject(sortedEntries));
}

export const isWithinTimeRange = (range: Date) => (time1: string, time2: string): boolean => (new Date(time2).getTime() - new Date(time1).getTime()) <= range;
