import React, { useEffect, useState } from 'react';

const StudentList = ({ studentList, setStudentList }) => {
	const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>({
		admingroups: true,
		arrivalgroup: true,
		educationform: true,
		evaluation: true,
		program: true,
		registration: true,
	});

	const addStudent = (event) => {
		event.preventDefault();
		const newStudent = {
			first_name: '',
			last_name: '',
			name: '',
			email: '',
			studentnumber: '',
			admingroups: '',
			arrivalgroup: '',
			educationform: '',
			evaluation: '',
			program: '',
			registration: '',
		};
		setStudentList([...studentList, newStudent]);
	};

	const deleteStudent = (index) => {
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
		<div className="h-1/2 overflow-x-scroll">
			<button
				aria-label="Show All Columns"
				className="p-1 bg-metropoliaMainOrange text-sm rounded-xl text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange mb-4"
				onClick={(event) => {
					event.preventDefault();
					setHiddenColumns({});
				}}
			>
				Show All Columns
			</button>
			<table className="table-auto w-full">
				<tbody className="flex flex-wrap justify-center">
				{studentList.map((student: Record<string, string | number>, index: number) => (
					<tr key={index} className="m-1">
						{Object.entries(student).map(([key, value], innerIndex) => (
							!hiddenColumns[key] && (
								<td key={innerIndex} className="border px-2 flex py-2">
									<button
										aria-label="Hide Column"
										className="p-1 text-black text-sm font-bold rounded hover:bg-metropoliaSecondaryOrange hover:text-white focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark"
										onClick={() => setHiddenColumns({ ...hiddenColumns, [key]: true })}
									>
										Hide
									</button>
									<input
										className="border rounded py-2 px-3 text-grey-800 w-fit ml-2"
										type="text"
										value={value.toString()}
										placeholder={key} // Set the key as the placeholder
										onChange={(e) => {
											const newStudentList = [...studentList];
											newStudentList[index][key] = e.target.value;
											setStudentList(newStudentList);
										}}
									/>
								</td>
							)
						))}
						{studentList.length > 1 && (
							<td className="border px-4 py-2">
								<button
									aria-label="Delete Student"
									type="button"
									className="p-1 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-700 focus:outline-none"
									onClick={() => deleteStudent(index)}
								>
									Delete Student
								</button>
							</td>
						)}
					</tr>
				))}
				</tbody>
			</table>
			<button
				className="p-1 text-sm bg-metropoliaMainOrange rounded-xl text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none mt-4 mb-2"
				onClick={(event) => addStudent(event)}
			>
				Add Student
			</button>
		</div>
	);
};

export default StudentList;
