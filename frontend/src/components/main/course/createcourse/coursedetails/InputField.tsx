import React from 'react';

const InputField = ({ label, type, name, value, onChange }) => (
	<div className="flex flex-col mb-3">
		<label className="mb-2 font-bold text-gray-900">{label}</label>
		<input
			className="border rounded py-2 px-3 text-grey-800"
			type={type}
			name={name}
			value={value}
			onChange={onChange}
		/>
	</div>
);
export default InputField;
