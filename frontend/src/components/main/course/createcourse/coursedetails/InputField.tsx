import React from 'react';

const InputField = ({label = '', type, name, value, onChange}) => (
	<div className="flex flex-col mb-3">
		<label className="mb-2 font-bold text-gray-900" htmlFor={name}>
			{label}
		</label>
		<input
			className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
			type={type}
			name={name}
			id={name}
			value={value}
			onChange={onChange}
			aria-label={label}
			required
		/>
	</div>
);
export default InputField;
