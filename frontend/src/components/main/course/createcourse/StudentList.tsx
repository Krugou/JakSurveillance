import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {IconButton} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, {useEffect, useState} from 'react';
import InputField from './coursedetails/InputField';
const StudentList = ({studentList, setStudentList}) => {
	const [lastStudentNumber, setLastStudentNumber] = useState(777);
	const [lastEmailNumber, setLastEmailNumber] = useState(1);
	const [sortAscending, setSortAscending] = useState(true);
	const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>({
		admingroups: true,
		arrivalgroup: true,
		educationform: true,
		evaluation: true,
		program: true,
		registration: true,
		name: true,
	});
	const [open, setOpen] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState<number | null>(null);
	const [hideExtraColumns, setHideExtraColumns] = useState(true);
	const [lockedFields, setLockedFields] = useState<boolean[]>(
		new Array(studentList.length).fill(true),
	);

	const handleClickOpen = (index: number) => {
		setToBeDeleted(index);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = () => {
		if (toBeDeleted !== null) {
			deleteStudent(toBeDeleted);
		}
		setOpen(false);
	};

	const toggleLock = (index: number) => {
		setLockedFields(prevLockedFields => {
			const newLockedFields = [...prevLockedFields];
			newLockedFields[index] = !newLockedFields[index];
			return newLockedFields;
		});
	};
	const addStudent = event => {
		event.preventDefault();
		const newStudent = {
			first_name: 'Matti',
			last_name: 'Meikäläinen',
			name: 'Meikäläinen Matti',
			email: `Matti.meikalainen${lastEmailNumber}@metropolia.com`,
			studentnumber: lastStudentNumber.toString(),
			admingroups: 'tvt19spo',
			arrivalgroup: 'xyz',
			educationform: 'Päivätoteutus',
			evaluation: '1',
			program: 'Degree Programme in Information Technology',
			registration: 'Hyväksytty',
		};
		setStudentList([...studentList, newStudent]);
		setLastStudentNumber(lastStudentNumber + 1);
		setLastEmailNumber(lastEmailNumber + 1);
	};
	const sortStudents = event => {
		event.preventDefault();
		const sortedStudentList = [...studentList].sort((a, b) =>
			sortAscending
				? a.last_name.localeCompare(b.last_name)
				: b.last_name.localeCompare(a.last_name),
		);
		setStudentList(sortedStudentList);
		setSortAscending(!sortAscending); // Toggle the sort direction for the next sort
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
						name: true,
				  } as Record<string, boolean>),
		);
		setHideExtraColumns(!hideExtraColumns);
	};

	return (
		<div className="relative">
			<div className="h-1/2 relative overflow-x-scroll">
				<button
					aria-label={hideExtraColumns ? 'Show All Columns' : 'Hide Extra Columns'}
					className="p-1 bg-metropoliaMainOrange text-sm text-white font-bold rounded-xl hover:bg-metropoliaSecondaryOrange focus:outline-none mb-4 sticky top-0 left-0"
					onClick={event => {
						event.preventDefault();
						toggleExtraColumns();
					}}
				>
					{hideExtraColumns ? 'Show All Columns' : 'Hide Extra Columns'}
				</button>
				<div className="max-h-96 h-96 overflow-y-scroll relative">
					<table className="table-auto w-full">
						<thead className="sticky top-0 bg-white z-10">
							<tr>
								{studentList.length > 0 &&
									Object.keys(studentList[0]).map(
										(key, index) =>
											!hiddenColumns[key] && (
												<th key={index} className="px-4 py-2">
													{key}
													{key === 'last_name' && (
														<button
															aria-label="Sort Column"
															className="ml-2 bg-metropoliaMainOrange text-sm text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-1"
															onClick={sortStudents}
														>
															Sort
														</button>
													)}
													<button
														aria-label="Hide Column"
														className="ml-2 bg-metropoliaMainOrange text-sm text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-1"
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
													<td key={innerIndex} className="border px-2 py-2">
														<InputField
															type="text"
															name={key}
															value={value.toString()}
															onChange={e => {
																const newStudentList = [...studentList];
																newStudentList[index][key] = e.target.value;
																setStudentList(newStudentList);
															}}
															disabled={lockedFields[index]}
														/>
													</td>
												),
										)}
										{studentList.length > 1 && (
											<td className="border px-4 py-2">
												<IconButton onClick={() => toggleLock(index)}>
													{lockedFields[index] ? <LockOpenIcon /> : <LockIcon />}
												</IconButton>
												<IconButton
													aria-label="Delete Student"
													color="error"
													onClick={() => handleClickOpen(index)}
												>
													<DeleteIcon />
												</IconButton>
												<Dialog
													open={open}
													onClose={handleClose}
													aria-labelledby="alert-dialog-title"
													aria-describedby="alert-dialog-description"
												>
													<DialogTitle id="alert-dialog-title">
														{'Delete Student'}
													</DialogTitle>
													<DialogContent>
														<DialogContentText id="alert-dialog-description">
															Are you sure you want to delete this student?
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button onClick={handleClose}>Cancel</Button>
														<Button onClick={handleDelete} color="error" autoFocus>
															Delete
														</Button>
													</DialogActions>
												</Dialog>
											</td>
										)}
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
				<button
					className="p-1 mt-2 text-sm sticky top-0 left-0 bg-metropoliaMainOrange text-white font-bold rounded-xl hover:bg-metropoliaSecondaryOrange focus:outline-none mb-4"
					onClick={event => addStudent(event)}
				>
					Add Student
				</button>
			</div>
		</div>
	);
};

export default StudentList;
