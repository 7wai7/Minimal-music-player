export default function clean<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => {
            if (v === undefined || v === null) return false;
            if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;
            return true;
        })
    ) as Partial<T>;
}
