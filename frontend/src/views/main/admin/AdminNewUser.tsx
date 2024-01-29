import {Container} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import FormInput from '../../../components/main/admin/newUser/FormInput';
import StudentGroupSelect from '../../../components/main/admin/newUser/StudentGroupSelect';
import SubmitButton from '../../../components/main/admin/newUser/SubmitButton';
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
							<FormInput
								label="Email"
								placeholder="Matti.Meikäläinen@metropolia.fi"
								value={email}
								onChange={setEmail}
							/>
							<FormInput
								label="First Name"
								placeholder="Matti"
								value={firstName}
								onChange={setFirstName}
							/>
							<FormInput
								label="Last Name"
								placeholder="Meikäläinen"
								value={lastName}
								onChange={setLastName}
							/>
							<FormInput
								label="Student Number"
								placeholder="123456"
								value={studentNumber}
								onChange={setStudentNumber}
							/>
							{isStudentNumberTaken && (
								<h2 className="text-red-500">Student number taken</h2>
							)}
							<StudentGroupSelect
								studentGroups={studentGroups}
								selectedGroup={studentGroupId}
								onChange={setStudentGroupId}
							/>
							<SubmitButton />
						</div>
					</form>
				</Container>
			</div>
		</>
	);
};

export default AdminNewUser;
