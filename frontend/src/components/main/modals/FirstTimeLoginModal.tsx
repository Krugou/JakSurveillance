import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const FirstTimeLoginModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalClassName = isOpen ? 'fixed inset-0 w-full flex items-center justify-center' : 'hidden';

    return (
        <div className={modalClassName}>
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white p-8 w-11/12 sm:w-4/5 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto rounded-lg z-10">
                {children}
            </div>
        </div>
    );
};

export default FirstTimeLoginModal;
