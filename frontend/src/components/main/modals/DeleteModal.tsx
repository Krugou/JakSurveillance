// DeleteModal.tsx
import React from 'react';

interface DeleteModalProps {
	isOpen: boolean;
	onDelete: () => void;
	onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
	isOpen,
	onDelete,
	onClose,
}) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="bg-white w-10/12 lg:w-1/3 sm:w-1/2 p-6 rounded-lg shadow-lg z-10">
				<h3 className="text-xl leading-6 font-medium text-gray-900">
					Confirmation
				</h3>
				<div className="mt-2">
					<p className="text-base text-gray-500">
						Are you sure you want to delete this course?
					</p>
				</div>
				<div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						onClick={onClose}
						className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						CANCEL
					</button>
					<button
						onClick={onDelete}
						className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						DELETE
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
