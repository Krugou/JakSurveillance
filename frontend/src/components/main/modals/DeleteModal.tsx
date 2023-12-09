// DeleteModal.tsx
import React from 'react';
/**
 * DeleteModalProps interface represents the structure of the DeleteModal props.
 * It includes properties for the modal's open state, delete function, close function, and a boolean to check if the user is a student.
 */
interface DeleteModalProps {
	isOpen: boolean;
	onDelete: () => void;
	onClose: () => void;
	student?: boolean;
}
/**
 * DeleteModal component.
 * This component is responsible for displaying a modal that allows users to confirm a delete action.
 * It uses the isOpen, onDelete, onClose, and student props to determine the current state of the modal and to handle user interactions.
 * The modal contains a confirmation message and two buttons: one to cancel the delete action and close the modal, and one to confirm the delete action.
 * The confirmation message and the color of the delete button depend on whether the user is a student.
 *
 * @param {DeleteModalProps} props The props that define the state and behavior of the modal.
 * @returns {JSX.Element | null} The rendered DeleteModal component, or null if the modal is not open.
 */
const DeleteModal: React.FC<DeleteModalProps> = ({
	isOpen,
	onDelete,
	onClose,
	student = false,
}) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div className="fixed inset-0 bg-black opacity-70"></div>
			<div
				className="bg-white w-10/12 lg:w-3/12 sm:w-1/2 p-6 rounded-lg shadow-lg z-10 border-4 border-red-700"
				onClick={e => e.stopPropagation()}
			>
				<h3 className="text-xl leading-6 font-medium text-gray-900">
					Confirmation
				</h3>
				<div className="mt-2">
					{student ? (
						<p className="text-base text-gray-500">
							Are you sure you want to delete student from this course? This will also
							delete all attendance data for this student on the course.
						</p>
					) : (
						<p className="text-base text-gray-500">
							Are you sure you want to delete this course?
						</p>
					)}
				</div>
				<div className="bg-white mt-2  sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						onClick={onClose}
						className="w-full inline-flex justify-center rounded-md border transition border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						CANCEL
					</button>
					<button
						onClick={onDelete}
						className="mt-3 w-full inline-flex justify-center transition rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						DELETE
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
