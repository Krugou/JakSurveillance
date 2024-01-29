import React from 'react';
interface StudentGroup {
	studentgroupid: number;
	group_name: string;
	// include other properties if they exist
}
interface StudentGroupSelectProps {
	studentGroups: StudentGroup[];
	selectedGroup: number | null;
	onChange: (value: number) => void;
}

const StudentGroupSelect: React.FC<StudentGroupSelectProps> = ({
	studentGroups,
	selectedGroup,
	onChange,
}) => (
	<label className="block mt-4">
		<span className="text-gray-700 font-bold">Student Group</span>
		<select
			required
			value={selectedGroup || ''}
			onChange={e => onChange(Number(e.target.value))}
			className="shadow appearance-none border rounded-3xl cursor-pointer w-full py-2 px-3 text-gray-700 mb-3 mt-1 leading-tight focus:outline-none focus:shadow-outline"
		>
			<option value="null">Not in system yet</option>
			{studentGroups.map(studentGroup => (
				<option
					key={studentGroup.studentgroupid}
					value={studentGroup.studentgroupid}
				>
					{studentGroup.group_name}
				</option>
			))}
		</select>
	</label>
);

export default StudentGroupSelect;
