import React from 'react';

interface InputFieldProps {
	label?: string;
	type: string;
	name: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
	label = '',
	type,
	name,
	value,
	onChange,
	disabled = false,
	placeholder = '',
}) => (
	<>
		<label className="mb-2 font-bold text-gray-900" htmlFor={name}>
			{label}
		</label>
		<input
			className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange ${
				!disabled ? 'border-black' : ''
			}`}
			type={type}
			name={name}
			id={name}
			value={value}
			onChange={onChange}
			aria-label={label}
			required
			disabled={disabled}
			placeholder={placeholder}
		/>
	</>
);

export default InputField;
