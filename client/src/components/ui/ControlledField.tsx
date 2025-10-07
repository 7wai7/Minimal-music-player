import { useSyncExternalStore } from "react";
import type { StoreApi } from "zustand";


export interface ControlledFieldProps<T extends object, E extends HTMLInputElement | HTMLTextAreaElement> extends Omit<React.InputHTMLAttributes<E>, "value" | "onChange"> {
    store: StoreApi<T>;                    // будь-який Zustand-store
    selector: (state: T) => string;        // вибираємо значення поля
    setField: (store: StoreApi<T>, value: string) => void; // функція для зміни поля
    as?: React.ElementType; // input або textarea
}

function ControlledField<T extends object, E extends HTMLInputElement | HTMLTextAreaElement>({
    store,
    selector,
    setField,
    as: Component = "input",
    ...props
}: ControlledFieldProps<T, E>) {
    // локальна підписка на store
    const value = useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState()),
        () => selector(store.getState()) // для SSR
    );

    return (
        <Component
            value={value ?? ""}
            onChange={(e: React.ChangeEvent<E>) => setField(store, e.target.value)}
            {...props}
        />
    );
}

export default ControlledField;