import useFieldErrors from "../../hooks/useFieldErrors";
import "../../styles/UploadModal.css";
import UploadSongTabs from "../UploadSongTabs";
import { useModalStore } from "../../stores/ModalStore";
import { useUploadDataStore } from "../../stores/UploadDataStore";
import { Input, Textarea } from "../ui/Input";
import { uploadSongFetch } from "../../API/songs";
import { useQueryClient } from "@tanstack/react-query";

function UploadModal() {
    const clearForm = useUploadDataStore(s => s.clearForm);
    const {
        errors,
        showErrors
    } = useFieldErrors();

    const queryClient = useQueryClient();


    const clearUploadForm = () => {
        const previewUrl = useUploadDataStore.getState().filesForm.previewUrl;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        clearForm();
        useModalStore.getState().close();
    }

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
    }

    return (
        <form className="upload-form" onSubmit={submitHandler}>
            <div className="l">
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
            <div className="r">
                <UploadSongTabs />

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