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
				<tbody className="flex">
				{studentList.map((student: Record<string, string | number>, index: number) => (
					<tr key={index}>
						{Object.entries(student).map(([key, value], innerIndex) => (
							!hiddenColumns[key] && (
								<React.Fragment key={innerIndex}>
									<td className="border px-2 flex py-2">
										<button
											aria-label="Hide Column"
											className="bg-metropoliaMainOrange p-1 text-white text-sm font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark mr-2"
											onClick={() => setHiddenColumns({ ...hiddenColumns, [key]: true })}
										>
											Hide
										</button>
										<div className="flex flex-col items-start">
											<span className="text-xs">{key}</span>
											<input
												className="border rounded py-2 px-3 text-grey-800 w-fit min-w-full"
												type="text"
												value={value.toString()}
												placeholder={key} // Set the key as the placeholder
												onChange={(e) => {
													const newStudentList = [...studentList];
													newStudentList[index][key] = e.target.value;
													setStudentList(newStudentList);
												}}
											/>
										</div>
									</td>
								</React.Fragment>
							)
						))}
						{studentList.length > 1 && (
							<td className="border px-4 py-2">
								<button
									aria-label="Delete Student"
									type="button"
									className="p-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none"
									onClick={() => deleteStudent(index)}
								>
									x
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
