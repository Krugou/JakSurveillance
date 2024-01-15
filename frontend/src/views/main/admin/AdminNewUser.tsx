import {Button, Container, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';

const AdminNewUser: React.FC = () => {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [studentNumber, setStudentNumber] = useState('');
	const [studentGroupId, setStudentGroupId] = useState<number | null>(null);
	const [isStudentNumberTaken, setIsStudentNumberTaken] = useState(false);
	interface StudentGroup {
		studentgroupid: number;
		group_name: string;
		// include other properties if they exist
	}

	const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
	const {user} = useContext(UserContext);

	// Check if the student number exists when it changes
	useEffect(() => {
		const checkStudentNumber = async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			try {
				const response = await apiHooks.checkStudentNumberExists(
					studentNumber,
					token,
				);

				if (response.exists) {
					setIsStudentNumberTaken(true);
				} else {
					setIsStudentNumberTaken(false);
				}
			} catch (error) {
				console.error('Failed to check if student number exists', error);
			}
		};

		if (studentNumber) {
			checkStudentNumber();
		}
	}, [studentNumber]);

	// Fetch all student groups when the component mounts
	useEffect(() => {
		const getStudentGroups = async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const fetchedStudentGroups = await apiHooks.fetchStudentGroups(token);

			setStudentGroups(fetchedStudentGroups);
		};
		getStudentGroups();
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Form validation
		if (!email || !studentNumber || !firstName || !lastName) {
			toast.error('Please fill in all fields');
			return;
		}

		if (user && !isStudentNumberTaken) {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				toast.error('No token available');
				return;
			}

			try {
				await apiHooks.addNewStudentUser(
					token,
					email,
					studentNumber,
					firstName,
					lastName,
					studentGroupId,
				);
				toast.success('New student user added successfully');
			} catch (error) {
				console.error('Failed to add new student user', error);
				toast.error('Failed to add new student user ' + error);
			}
		} else if (isStudentNumberTaken) {
			toast.error('The student number is already taken');
		}
	};

	return (
		<>
			<Typography variant="h4" component="h1" gutterBottom className="text-center">
				Add New Student User
			</Typography>
			<div className="relative lg:w-fit w-full bg-white">
				<Container>
					<form onSubmit={handleSubmit} className="mt-4 mb-4 ">
						<div className="flex flex-col">
							<TextField
								label="Email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								margin="normal"
							/>
							<TextField
								label="First Name"
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								required
								margin="normal"
							/>
							<TextField
								label="Last Name"
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								required
								margin="normal"
							/>
							<TextField
								label="Student Number"
								value={studentNumber}
								onChange={e => setStudentNumber(e.target.value)}
								required
								margin="normal"
							/>
						</div>
						<label className="block mt-4">
							<span className="text-gray-700 font-bold">Student Group</span>
							<select
								required
								value={studentGroupId || ''}
								onChange={e => setStudentGroupId(Number(e.target.value))}
								className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
						<button
							type="submit"
							className="bg-metropoliaMainOrange text-md text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-4 m-4"
						>
							Add New Student User
						</button>
					</form>
				</Container>
			</div>
		</>
	);
};

export default AdminNewUser;
