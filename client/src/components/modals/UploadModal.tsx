import useFieldErrors, { type Errors } from "../../hooks/useFieldErrors";
import "../../styles/UploadModal.css";
import UploadSongTabs from "../UploadSongTabs";
import { useModalStore } from "../../stores/ModalStore";
import { useUploadDataStore } from "../../stores/UploadDataStore";
import { Input, Textarea } from "../ui/Input";
import { uploadSongFetch } from "../../API/songs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "../Loader";

function UploadModal() {
    const clearForm = useUploadDataStore(s => s.clearForm);
    const {
        errors,
        showErrors
    } = useFieldErrors();
    const [isFetching, setIsFetching] = useState(false);
    const queryClient = useQueryClient();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);


    const clearUploadForm = () => {
        const previewUrl = useUploadDataStore.getState().filesForm.previewUrl;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        clearForm();
        useModalStore.getState().close();
    }

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFetching) return;
        setIsFetching(true);

        const { file, fileImg } = useUploadDataStore.getState().filesForm;

        if (!file) return;
        showErrors([]);

        const formData = new FormData();
        formData.append('file', file);
        if (fileImg) formData.append('file_preview', fileImg);

        const form = useUploadDataStore.getState().uploadForm;
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        })

        uploadSongFetch(formData)
            .then(() => {
                clearUploadForm();
                queryClient.invalidateQueries({ queryKey: ["songs"] });
            })
            .catch(err => {
                showErrors(err.errors || [])
            })
            .finally(() => setIsFetching(false))
    }

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 700);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <>
            <form className="upload-form" onSubmit={submitHandler}>
                {!isMobile && <TitleLyricsForm errors={errors} />}
                <div className="right-panel">
                    <UploadSongTabs
                        {
                        ...(isMobile
                            ? { titleLyricsForm: <TitleLyricsForm errors={errors} /> }
                            : {})
                        }
                    />
                    <SubmitBtn disabled={isFetching} />
                </div>
            </form>
            {
                isFetching && (
                    <div className="is-fetching-modal">
                        <Loader title="Uploading..." />
                    </div>
                )
            }
        </>
    );
}

function TitleLyricsForm({
    errors
}: {
    errors: Errors
}) {
    return (
        <div className="title-lyrics-form">
            <label className="title-label">Title</label>
            <Input
                store={useUploadDataStore}
                selector={(s) => s.uploadForm.title ?? ""}
                setField={(store, value) => store.getState().setUploadForm("title", value)}
                type="text"
                required
                className={`title-input ${errors.title ? "error" : ""}`}
            />
            {
                errors.title && <span className="error-message">{errors.title.message}</span>
            }
            <label className="lyrics-label">Lyrics</label>
            <Textarea
                store={useUploadDataStore}
                selector={(s) => s.uploadForm.lyrics ?? ""}
                setField={(store, value) => store.getState().setUploadForm("lyrics", value)}
                name="lyrics"
                className={`lyrics-textarea ${errors.lyrics ? "error" : ""}`}
            />
            {
                errors.lyrics && <span className="error-message">{errors.lyrics.message}</span>
            }
        </div>
    )
}

function SubmitBtn({
    disabled = false
}: {
    disabled: boolean
}) {
    const uploadForm = useUploadDataStore(s => s.uploadForm);
    const filesForm = useUploadDataStore(s => s.filesForm);

    return (
        <button
            type="submit"
            disabled={disabled || !uploadForm.title || !uploadForm.genre || !filesForm.file}
            className="submit-btn"
        >
            Upload
        </button>
    )
}

export default UploadModal;