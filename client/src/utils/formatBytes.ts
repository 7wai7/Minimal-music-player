export const SIZES = ['Bytes', 'KB', 'MB', 'GB'];

export default function formatBytes(bytes: number): string {
    if (bytes == 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const result = (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + SIZES[i];
    return result
};