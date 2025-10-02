import { useState } from "react";
import "../../styles/UploadModal.css"
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import formatBytes from "../../utils/formatBytes";
import formatDuration from "../../utils/formatDuration";
import getAudioDuration from "../../utils/getAudioDuration";
import getFileExt from "../../utils/getFileExt";
import { uploadSongFetch } from "../../API/songs";
import useFieldErrors from "../../hooks/useFieldErrors";

interface UploadForm {
    title: string,
    lyrics?: string,
    genre: string,
    release_date?: string
}

function UploadModal() {
    const [uploadData, setUploadData] = useState<Partial<UploadForm>>({});
    const [file, setFile] = useState<File | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const {
        errors,
        showErrors
    } = useFieldErrors();

    const {
        drag,
        fileInputRef,
        dragStartHandler,
        dragLeaveHandler,
        dropHandler,
        openFileDialog,
        changeHandler,
    } = useDragAndDrop(
        async (files: File[]) => {
            const file = files[0];
            if (!file?.type.startsWith("audio/")) return;
            setFile(file);
            const duration = await getAudioDuration(file);
            setDuration(duration);
        }
    );

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        showErrors([]);

        const formData = new FormData();
        formData.append('file', file);
        Object.entries(uploadData).forEach(([key, value]) => {
            formData.append(key, value);
        })

        uploadSongFetch(formData)
            .then(() => {
                setUploadData({});
                setFile(null);
                setDuration(null);

            })
            .catch(err => {
                showErrors(err.errors || [])
            })
    }

    return (
        <form className="upload-form" onSubmit={submitHandler}>
            <div className="l">
                <label className="title-label">Title</label>
                <input
                    type="text"
                    required
                    className={`title-input ${errors.title ? "error" : ""}`}
                    value={uploadData.title || ""}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
                {
                    errors.title && <span className="error-message">{errors.title.message}</span>
                }
                <label className="lyrics-label">Lyrics</label>
                <textarea
                    name="lyrics"
                    className={`lyrics-textarea ${errors.lyrics ? "error" : ""}`}
                    value={uploadData.lyrics || ""}
                    onChange={(e) => setUploadData({ ...uploadData, lyrics: e.target.value })}
                />
                {
                    errors.lyrics && <span className="error-message">{errors.lyrics.message}</span>
                }
            </div>
            <div className="r">
                <input
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={changeHandler}
                />

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
                    <span>Genre: <input
                        type="text"
                        name="genre"
                        required
                        className="genre-input"
                        onChange={(e) => setUploadData({ ...uploadData, genre: e.target.value })}
                    /></span>
                    <span>Release date: <input
                        type="date"
                        name="date"
                        className="date-input"
                        onChange={(e) => setUploadData({ ...uploadData, release_date: e.target.value })}
                    /></span>
                </div>
                <button
                    type="submit"
                    className="submit-btn"
                >
                    Upload
                </button>
            </div>
        </form>
    );
}

export default UploadModal;