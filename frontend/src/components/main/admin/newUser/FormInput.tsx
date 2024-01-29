import React from 'react';

interface FormInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({
	label,
	placeholder,
	value,
	onChange,
}) => (
	<label className="block mt-4">
		<span className="text-gray-700 font-bold">{label}</span>
		<input
			placeholder={placeholder}
			value={value}
			onChange={e => onChange(e.target.value)}
			className="shadow mt-1 appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</label>
);

export default FormInput;
