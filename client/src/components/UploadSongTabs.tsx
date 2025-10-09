import { memo, useCallback, useEffect, type JSX } from "react";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import formatBytes from "../utils/formatBytes";
import formatDuration from "../utils/formatDuration";
import getFileExt from "../utils/getFileExt";
import Tabs from "./Tabs";
import { useUploadDataStore } from "../stores/UploadDataStore";
import { Input } from "./ui/Input";
import getAudioDuration from "../utils/getAudioDuration";

interface Props {
    titleLyricsForm?: JSX.Element
}

function UploadSongTabs({
    titleLyricsForm
}: Props) {
    const setUploadForm = useUploadDataStore(s => s.setUploadForm);
    const setFilesForm = useUploadDataStore(s => s.setFilesForm);
    const file = useUploadDataStore(s => s.filesForm.file);
    const fileImg = useUploadDataStore(s => s.filesForm.fileImg);
    const duration = useUploadDataStore(s => s.filesForm.duration);
    const previewUrl = useUploadDataStore(s => s.filesForm.previewUrl);

    const onFiles = useCallback(async (files: File[]) => {
        const file = files[0];
        if (!file?.type.startsWith("audio/")) return;
        setFilesForm("file", file);
        const title = file.name.replace(/\.[^/.]+$/, '');
        if (title) setUploadForm("title", title);
        const duration = await getAudioDuration(file);
        setFilesForm("duration", duration);
    }, []);

    const onFilesImg = useCallback(async (files: File[]) => {
        const file = files[0];
        if (!file?.type.startsWith("image/")) return;
        setFilesForm("fileImg", file);
        // створюємо тимчасовий URL
        const url = URL.createObjectURL(file);
        setFilesForm("previewUrl", url);
    }, []);

    const {
        drag,
        fileInputRef,
        dragStartHandler,
        dragLeaveHandler,
        dropHandler,
        openFileDialog,
        changeHandler,
    } = useDragAndDrop(onFiles);

    const {
        drag: dragImg,
        fileInputRef: fileInputRefImg,
        dragStartHandler: dragStartHandlerImg,
        dragLeaveHandler: dragLeaveHandlerImg,
        dropHandler: dropHandlerImg,
        openFileDialog: openFileDialogImg,
        changeHandler: changeHandlerImg,
    } = useDragAndDrop(onFilesImg);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        onFilesImg([...dataTransfer.files]);
                    }
                }
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, []);

    return (
        <>
            <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                className="hidden"
                onChange={changeHandler}
            />

            <input
                type="file"
                accept="image/*"
                ref={fileInputRefImg}
                className="hidden"
                onChange={changeHandlerImg}
            />


            <Tabs
                tabs={[
                    ...(titleLyricsForm
                        ? [{
                            navBtn: <button type="button">
                                Title
                            </button>,
                            content: titleLyricsForm
                        }]
                        : []),
                    {
                        navBtn: <button type="button">
                            Sound file
                        </button>,
                        content: (
                            <div className="tab-sound-file">
                                {
                                    !file
                                        ? <div
                                            className={`drag-drop-field ${drag ? "drag" : ""}`}
                                            onDragStart={dragStartHandler}
                                            onDragLeave={dragLeaveHandler}
                                            onDragOver={dragStartHandler}
                                            onDrop={dropHandler}
                                        >
                                            <button type="button" onClick={openFileDialog}>
                                                {drag ? "Release the file" : "Drag and drop file"}
                                            </button>
                                        </div>
                                        : <div className="selected-file">
                                            <span className="file-name">{file.name}</span>
                                            <button type="button" onClick={openFileDialog} className="change-file-btn">Change file</button>
                                        </div>
                                }
                                <div className="file-info">
                                    <span>Size: {file ? formatBytes(file.size) : "-"}</span>
                                    <span>Duration: {file && duration ? formatDuration(duration) : "-"}</span>
                                    <span>Extension: {file ? getFileExt(file) : "-"}</span>
                                </div>
                                <div className="other-inputs">
                                    <span>Genre: <Input
                                        store={useUploadDataStore}
                                        selector={(s) => s.uploadForm.genre ?? ""}
                                        setField={(store, value) => store.getState().setUploadForm("genre", value)}
                                        type="text"
                                        name="genre"
                                        required
                                        className="genre-input"
                                    />
                                    </span>
                                    <span>Release date:  <Input
                                        store={useUploadDataStore}
                                        selector={(s) => s.uploadForm.release_date ?? ""}
                                        setField={(store, value) => store.getState().setUploadForm("release_date", value)}
                                        type="date"
                                        name="date"
                                        className="date-input"
                                    />
                                    </span>
                                </div>
                            </div>
                        )
                    },
                    {
                        navBtn: <button type="button">
                            Preview image
                        </button>,
                        content: <>
                            {
                                (!fileImg || !previewUrl)
                                    ? <div
                                        className={`drag-drop-field ${dragImg ? "drag" : ""}`}
                                        onDragStart={dragStartHandlerImg}
                                        onDragLeave={dragLeaveHandlerImg}
                                        onDragOver={dragStartHandlerImg}
                                        onDrop={dropHandlerImg}
                                    >
                                        <button type="button" onClick={openFileDialogImg}>
                                            {dragImg ? "Release the img" : "Drag and drop img"}
                                        </button>
                                    </div>
                                    : <button type="button" className="preview-img-wrapper" onClick={openFileDialogImg}>
                                        <img src={previewUrl} alt="" className="preview-img" />
                                        <div className="preview-cover">Change image</div>
                                    </button>
                            }
                        </>
                    }
                ]}
            />
        </>
    );
}

export default memo(UploadSongTabs);