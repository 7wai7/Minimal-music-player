import ControlledField, { type ControlledFieldProps } from "./ControlledField";

export function Input<T extends object>({
    store,
    selector,
    setField,
    ...props
}: Omit<ControlledFieldProps<T, HTMLInputElement>, "as">) {
    return (
        <ControlledField
            as="input"
            store={store}
            selector={selector}
            setField={setField}
            {...props}
        />
    );
}

export function Textarea<T extends object>({
    store,
    selector,
    setField,
    ...props
}: Omit<ControlledFieldProps<T, HTMLTextAreaElement>, "as">) {
    return (
        <ControlledField
            as="textarea"
            store={store}
            selector={selector}
            setField={setField}
            {...props}
        />
    );
}
