import axios from "axios";
import { useEffect, useState } from "react";

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fileUrl?: string;
    defaultUrl?: string;
}

export default function Img({
    fileUrl,
    defaultUrl = "/image-not-available.jpg",
    onError,
    ...props
}: ImgProps) {
    const [src, setSrc] = useState(defaultUrl);

    useEffect(() => {
        if (!fileUrl) return setSrc(defaultUrl);

        let cancelled = false;

        (async () => {
            try {
                const res = await axios(
                    `/api/storage/download?url=${encodeURIComponent(fileUrl)}&mode=inline`
                );
                if (!cancelled) setSrc(res.data.url);
            } catch {
                if (!cancelled) {
                    setSrc(defaultUrl);
                    onError?.(new Event("error") as any);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [fileUrl, defaultUrl]);

    return <img
        src={src}
        onError={(e) => {
            setSrc(defaultUrl);
            onError?.(e);
        }}
        {...props}
    />;
}
