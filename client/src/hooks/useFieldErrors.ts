import { useState } from "react";

type Errors = Record<string, { message: string }>;

export default function useFieldErrors() {
    const initialErrors: Errors = {};
    const [errors, setErrors] = useState(initialErrors);

    const showErrors = (errors: { field: string; message: string }[]) => {
        const updated: Errors = {};
        for (const err of errors) {
            updated[err.field] = { message: err.message };
        }
        setErrors(updated);
    };


    return {
        errors,
        setErrors,
        showErrors
    }
}