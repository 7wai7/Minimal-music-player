import { useEffect, useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
    fileUrl?: string,
    originalname: string,
    defaultUrl: string
}

function Img({
    fileUrl,
    originalname,
    defaultUrl,
    ...props
}: Props) {
    const [src, setSrc] = useState(defaultUrl);
    const [isLoading, setIsLoading] = useState(!!fileUrl);

    useEffect(() => {
        if (!fileUrl) return;

        const fetchImageUrl = async () => {
            try {
                const res = await fetch(
                    `/api/storage/download?url=${encodeURIComponent(fileUrl)}&originalname=${encodeURIComponent(originalname)}&mode=inline`
                );

                if (!res.ok) throw new Error("Failed to fetch signed URL");

                const data = await res.json();
                setSrc(data.url);
            } catch {
                setSrc(defaultUrl);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImageUrl();
    }, [fileUrl, originalname, defaultUrl]);

    if (isLoading) return <p>Loading image...</p>;

    return <img src={src} {...props} />;
}

export default Img;