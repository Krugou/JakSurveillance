import React, {useEffect, useState} from 'react';
import InputField from './coursedetails/InputField';

const StudentList = ({studentList, setStudentList}) => {
	const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>({
		admingroups: true,
		arrivalgroup: true,
		educationform: true,
		evaluation: true,
		program: true,
		registration: true,
	});
	const [hideExtraColumns, setHideExtraColumns] = useState(true);

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

	const toggleExtraColumns = () => {
		setHiddenColumns(() =>
			hideExtraColumns
				? {}
				: ({
						admingroups: true,
						arrivalgroup: true,
						educationform: true,
						evaluation: true,
						program: true,
						registration: true,
				  } as Record<string, boolean>),
		);
		setHideExtraColumns(!hideExtraColumns);
	};

	return (
		<div className="overflow-hidden h-1/2">
			<button
				aria-label={hideExtraColumns ? 'Show All Columns' : 'Hide Extra Columns'}
				className="p-1 bg-metropoliaMainOrange text-sm text-white font-bold rounded-xl hover:bg-metropoliaSecondaryOrange focus:outline-none mb-4"
				onClick={event => {
					event.preventDefault();
					toggleExtraColumns();
				}}
			>
				{hideExtraColumns ? 'Show All Columns' : 'Hide Extra Columns'}
			</button>
			<table className="table-auto w-full">
				<div className="max-h-96 h-96 overflow-y-scroll">
					<thead className="sticky top-0 bg-white z-10">
						<tr>
							{studentList.length > 0 &&
								Object.keys(studentList[0]).map(
									(key, index) =>
										!hiddenColumns[key] && (
											<th key={index} className="px-4 py-2">
												{key}
												<button
													aria-label="Hide Column"
													className="ml-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-2"
													onClick={() =>
														setHiddenColumns(
															(prevHiddenColumns: Record<string, boolean>) => ({
																...prevHiddenColumns,
																[key]: true,
															}),
														)
													}
												>
													Hide
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
													<InputField
														type="text"
														name={key}
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
												aria-label="Delete Student"
												type="button"
												className="p-2 bg-red-500 text-white font-bold rounded hover:metropoliaSecondaryOrange focus:outline-none"
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
				</div>
			</table>
			<button
				className="p-1 mt-2 text-sm bg-metropoliaMainOrange text-white font-bold rounded-xl hover:bg-metropoliaSecondaryOrange focus:outline-none mb-4"
				onClick={event => addStudent(event)}
			>
				Add Student
			</button>
		</div>
	);
};

export default StudentList;
