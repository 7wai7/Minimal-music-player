import { memo, useEffect, useRef, type JSX } from 'react';
import "../../styles/Modal.css";
import type { ModalType } from '../../types/modal';
import { useModalStore } from '../../stores/ModalStore';

interface Props {
    children: JSX.Element | JSX.Element[];
    type: ModalType;
}

const Modal = ({
    children,
    type
}: Props) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = useModalStore.subscribe((state, prev) => {
            if (state[type] !== prev[type] && overlayRef.current) {
                if (state[type]) overlayRef.current.classList.add("show");
                else overlayRef.current.classList.remove("show");
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div ref={overlayRef} className={`modal-overlay ${type}`}>
            <div className='modal-content-wrapper'>
                <div className={`modal-content`}>
                    {children}
                </div>
            </div>
        </div>
    )
};

export default memo(Modal);