import React, {useEffect} from 'react';

const StudentList = ({studentList, setStudentList, deleteStudent}) => {
	const addStudent = () => {
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

	useEffect(() => {
		if (studentList.length === 0) {
			addStudent();
		}
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<div className="overflow-hidden h-1/2">
			<div className="flex">
				{studentList.length > 0 &&
					Object.keys(studentList[0]).map(key => (
						<div className="p-2 w-full md:w-auto">
							<label className="block">{key}</label>
						</div>
					))}
			</div>
			{studentList.map(
				(student: Record<string, string | number>, index: number) => (
					<div key={index} className="flex">
						{Object.entries(student).map(([key, value]) => (
							<div className="p-2 w-full  md:w-auto">
								<label htmlFor={key}>
									<input
										className="border rounded py-2 px-3 text-grey-800 w-full"
										type="text"
										name={key}
										value={value.toString()}
										onChange={e => {
											const newStudentList = [...studentList];
											newStudentList[index][key] = e.target.value;
											setStudentList(newStudentList);
										}}
									/>
								</label>
							</div>
						))}
						{studentList.length > 1 && (
							<div className="p-2 w-full md:w-auto">
								<button
									type="button"
									className="p-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
									onClick={() => deleteStudent(index)}
								>
									x
								</button>
							</div>
						)}
					</div>
				),
			)}
			<button
				className="p-2 bg-green-500 text-white font-bold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
				onClick={addStudent}
			>
				Add Student
			</button>
		</div>
	);
};

export default StudentList;
