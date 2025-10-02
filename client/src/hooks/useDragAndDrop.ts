import { useRef, useState } from "react";

export function useDragAndDrop(onFiles: (files: File[]) => void) {
    const [drag, setDrag] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(true);
    };

    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(false);
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(false);
        const files = [...e.dataTransfer.files];
        onFiles(files);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = [...e.target.files];
            onFiles(files);
        }
    };

    return {
        drag,
        fileInputRef,
        dragStartHandler,
        dragLeaveHandler,
        dropHandler,
        openFileDialog,
        changeHandler,
    };
}
