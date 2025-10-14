export default function truncateString(str: string, maxLength: number) {
    if (str.length > maxLength) {
        // Subtract 3 from maxLength to account for the "..."
        return str.slice(0, maxLength - 3) + '...';
    }
    return str;
}