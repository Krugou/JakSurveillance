import React from 'react';

interface SubmitButtonProps {
	disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({disabled}) => (
	<div className="w-full flex justify-center">
		<button
			type="submit"
			disabled={disabled}
			className={`mt-5 mb-2 p-2 w-fit bg-metropoliaTrendGreen hover:bg-green-600 transition text-white rounded-md ${
				disabled ? 'opacity-50 cursor-not-allowed' : ''
			}`}
		>
			Add New Student User
		</button>
	</div>
);

export default SubmitButton;
