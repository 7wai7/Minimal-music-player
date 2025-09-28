import { useEffect } from "react";

export default function useAutoResizeTextarea(
    textareaRef: React.RefObject<HTMLTextAreaElement>
) {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const resize = () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        };

        resize();
        textarea.addEventListener("input", resize);
        return () => textarea.removeEventListener("input", resize);
    }, [textareaRef]);
}
