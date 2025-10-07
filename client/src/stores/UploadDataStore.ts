import { create } from "zustand"
import type UploadForm from "../types/uploadForm";

interface FilesForm {
    file: File | null;
    fileImg: File | null;
    previewUrl: string | null;
    duration: number | null;
}

type UploadData = {
    uploadForm: Partial<UploadForm>;
    setUploadForm: <K extends keyof UploadForm>(field: K, value: UploadForm[K]) => void;

    filesForm: Partial<FilesForm>;
    setFilesForm: <K extends keyof FilesForm>(field: K, value: FilesForm[K]) => void;
    
    clearForm: () => void;
}

export const useUploadDataStore = create<UploadData>((set, get) => ({
    uploadForm: {},
    setUploadForm: (field, value) => set({ uploadForm: { ...get().uploadForm, [field]: value } }),

    filesForm: {},
    setFilesForm: (field, value) => set({ filesForm: { ...get().filesForm, [field]: value } }),
    
    clearForm: () => set({ uploadForm: {}, filesForm: {} }),
}));