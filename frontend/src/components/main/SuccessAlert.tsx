import React from 'react';

interface SuccessAlertProps {
	successAlert: string;
	onClose: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({successAlert, onClose}) => {
	return (
		<div
			className={`fixed inset-0 flex items-center justify-center ${
				successAlert ? 'block' : 'hidden'
			}`}
		>
			<div className="modal-container mx-auto p-4 mt-10 rounded-lg bg-green-100 shadow-lg w-96">
				<h2 className="text-xl text-green-600 font-bold mb-4">Success</h2>
				<div className="mb-4">
					{successAlert && <p className="text-green-700">{successAlert}</p>}
				</div>
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuccessAlert;
