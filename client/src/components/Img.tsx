import axios from "axios";
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

    useEffect(() => {
        setSrc(defaultUrl);
        if (!fileUrl) return;

        const fetchImageUrl = async () => {
            try {
                const res = await axios(
                    `/api/storage/download?url=${encodeURIComponent(fileUrl)}&originalname=${encodeURIComponent(originalname)}&mode=inline`
                );
                setSrc(res.data.url);
            } catch {
                setSrc(defaultUrl);
            }
        };

        fetchImageUrl();
    }, [fileUrl, originalname, defaultUrl]);

    return <img src={src} {...props} />;
}

export default Img;