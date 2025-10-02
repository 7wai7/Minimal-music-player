import { memo, type JSX } from 'react';
import "../styles/Modal.css";

interface Props {
    children: JSX.Element | JSX.Element[];
    isOpen: boolean;
    className: string;
}

const Modal = ({
    children,
    isOpen,
    className
}: Props) => {
    // console.log("render modal");

    // return ReactDOM.createPortal(
    return <div className={`modal-overlay ${className} ${isOpen ? "show" : ""}`}>
        <div className='modal-content'>
            {children}
        </div>
    </div>
    // document.getElementById('modal-root')!
    // );
};

export default memo(Modal);