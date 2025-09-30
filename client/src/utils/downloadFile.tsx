export default async function downloadFile(fileUrl: string, originalname: string) {
    const res = await fetch(`/api/storage/download?url=${fileUrl}&originalname=${originalname}`, {
        credentials: 'include',
    });

    const { url } = await res.json();

    const a = document.createElement('a');
    a.href = url;
    a.download = originalname;
    document.body.appendChild(a);
    a.click();
    a.remove();
};