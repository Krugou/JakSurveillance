import React, {useEffect, useState} from 'react';

const StudentList = ({studentList, setStudentList}) => {
	const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>(
		{},
	);
	const addStudent = event => {
		event.preventDefault();
		const newStudent = {
			first_name: 'example',
			last_name: 'example',
			name: 'example',
			email: 'example@gmail.com',
			studentnumber: '2442',
			admingroups: 'example',
			arrivalgroup: 'example',
			educationform: 'example',
			evaluation: 'example',
			program: 'example',
			registration: 'example',
		};
		setStudentList([...studentList, newStudent]);
	};
	const deleteStudent = index => {
		const newStudentList = [...studentList];
		newStudentList.splice(index, 1);
		setStudentList(newStudentList);
	};

	useEffect(() => {
		if (studentList.length === 0) {
			addStudent(event);
		}
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<div className="overflow-hidden h-1/2">
			<table className="table-auto w-full">
				<thead>
					<tr>
						{studentList.length > 0 &&
							Object.keys(studentList[0]).map(
								(key, index) =>
									!hiddenColumns[key] && (
										<th key={index} className="px-4 py-2">
											{key}
											<button
												className="ml-2"
												onClick={() => setHiddenColumns({...hiddenColumns, [key]: true})}
											>
												H
											</button>
										</th>
									),
							)}
						{studentList.length > 1 && <th className="px-4 py-2">Actions</th>}
					</tr>
				</thead>
				<tbody>
					{studentList.map(
						(student: Record<string, string | number>, index: number) => (
							<tr key={index}>
								{Object.entries(student).map(
									([key, value], innerIndex) =>
										!hiddenColumns[key] && (
											<td key={innerIndex} className="border px-4 py-2">
												<input
													className="border rounded py-2 px-3 text-grey-800 w-full"
													type="text"
													value={value.toString()}
													onChange={e => {
														const newStudentList = [...studentList];
														newStudentList[index][key] = e.target.value;
														setStudentList(newStudentList);
													}}
												/>
											</td>
										),
								)}
								{studentList.length > 1 && (
									<td className="border px-4 py-2">
										<button
											type="button"
											className="p-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
											onClick={() => deleteStudent(index)}
										>
											x
										</button>
									</td>
								)}
							</tr>
						),
					)}
				</tbody>
			</table>
			<button
				className="p-2 bg-green-500 text-white font-bold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
				onClick={event => addStudent(event)}
			>
				Add Student
			</button>
		</div>
	);
};

export default StudentList;
