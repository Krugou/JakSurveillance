import React from 'react';

const SubmitButton: React.FC = () => (
	<div className="w-full flex justify-center">
		<button
			type="submit"
			className="mt-5 mb-2 p-2 w-fit bg-metropoliaTrendGreen hover:bg-green-600 transition text-white rounded-md"
		>
			Add New Student User
		</button>
	</div>
);

export default SubmitButton;
