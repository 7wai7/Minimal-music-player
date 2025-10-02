export default function getFileExt(file: File) {
    return file.name.split('.').pop() || "";
}