import { useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import Img from "./ui/Img";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;                  // URL картинки (або undefined)
    alt?: string;                  // Alt для картинки
    fallbackIcon?: JSX.Element;    // Можливість передати свою fallback-іконку
    linkTo?: string;               // Якщо передано — аватар стає посиланням
    className?: string;            // Додаткові класи
    changeCover?: JSX.Element;
}

export default function Avatar({
    src,
    alt,
    fallbackIcon = <UserIcon size="40%" color="var(--theme-2)" />,
    linkTo,
    className = "",
    changeCover,
    ...props
}: AvatarProps): JSX.Element {
    const [error, setError] = useState(false);

    const content = (
        <div
            className={`preview-img-wrapper avatar-wrapper ${error || !src ? "icon-wrapper default" : ""} ${className}`}
            {...props}
        >
            {!error && src ? (
                <>
                    <Img
                        fileUrl={src}
                        alt={alt}
                        className="avatar preview-img"
                        onError={() => setError(true)}
                    />
                    {changeCover}
                </>
            ) : (
                <>
                    {fallbackIcon}
                    {changeCover}
                </>
            )}
        </div>
    );

    return linkTo ? <Link to={linkTo}>{content}</Link> : content;
}