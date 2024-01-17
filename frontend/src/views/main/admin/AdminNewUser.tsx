import {Container, TextField, Typography} from '@mui/material';
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
			<h1 className="text-2xl font-bold w-fit p-3 bg-white ml-auto mr-auto rounded-lg mb-5 text-center">
				Add New Student User
			</h1>
			<div className="relative w-fit bg-white rounded-lg">
				<Container>
					<form onSubmit={handleSubmit} className="mt-4 mb-4 ">
						<div className="flex flex-col">
							<h2 className="font-bold text-center text-xl">Student Details</h2>
							<label className="block mt-4">
								<span className="text-gray-700 font-bold">Email</span>
								<input
									placeholder="Matti.Meikäläinen@metropolia.fi"
									name="Email"
									value={email}
									required
									onChange={e => setEmail(e.target.value)}
									className="shadow mt-1 appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</label>

							<label className="block mt-4">
								<span className="text-gray-700 font-bold">First Name</span>
								<input
									placeholder="Matti"
									name="firstname"
									value={firstName}
									onChange={e => setFirstName(e.target.value)}
									className="shadow mt-1 appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</label>
							<label className="block mt-4">
								<span className="text-gray-700 font-bold">Last Name</span>
								<input
									placeholder="Meikäläinen"
									name="lastname"
									value={lastName}
									onChange={e => setLastName(e.target.value)}
									className="shadow mt-1 appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</label>
							<label className="block mt-4">
								<span className="text-gray-700 font-bold">Student Number</span>
								<input
									placeholder="123456"
									name="studentnumber"
									value={studentNumber}
									onChange={e => setStudentNumber(e.target.value)}
									className="shadow mt-1 appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								/>
								{isStudentNumberTaken && (
									<h2 className="text-red-500">Student number taken</h2>
								)}
							</label>
						</div>
						<label className="block mt-4">
							<select
								required
								value={studentGroupId || ''}
								onChange={e => setStudentGroupId(Number(e.target.value))}
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
						<div className="w-full flex justify-center">
						<button
							type="submit"
							className="mt-5 mb-2 p-2 w-fit bg-metropoliaTrendGreen hover:bg-green-600 transition text-white rounded-md"
						>
							Add New Student User
						</button>
						</div>
					</form>
				</Container>
			</div>
		</>
	);
};

export default AdminNewUser;
