import React, {useEffect, useRef, useState} from 'react';
import apihooks from '../../../hooks/ApiHooks';
interface EditUserViewProps {
	user: {
		role: string;
		first_name: string;
		last_name: string;
		email: string;
		studentnumber: number;
		userid: string;
		username: string;
		created_at: string;
		GDPR: number;
		roleid: number;
		staff: number;
		studentgroupid: number;
	};
	onSave: (user: EditUserViewProps['user']) => void;
}
interface StudentGroup {
	studentgroupid: number;
	group_name: string;
	// include other properties if they exist
}
interface Role {
	roleid: number;
	name: string;
	// include other properties if they exist
}

const EditUserView: React.FC<EditUserViewProps> = ({user, onSave}) => {
	const [editedUser, setEditedUser] = useState(user);
	const [roles, setRoles] = useState<Role[]>([]);
	const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
	const isStudentNumberTakenRef = useRef(false);
	const [originalStudentNumber, setOriginalStudentNumber] = useState(
		user.studentnumber,
	);
	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		let value = event.target.value;
		if (event.target.name === 'studentnumber') {
			value = isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10).toString();
		}
		setEditedUser({
			...editedUser,
			[event.target.name]: value,
		});
	};
	const handleSaveClick = () => {
		onSave(editedUser);
	};
	useEffect(() => {
		const getRoles = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const fetchedRoles = await apihooks.fetchAllRoles(token);

			setRoles(fetchedRoles);
		};

		getRoles();
	}, []);
	useEffect(() => {
		const checkStudentNumber = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			// Only check if the student number has changed from the original
			if (editedUser.studentnumber !== originalStudentNumber) {
				const exists = await apihooks.checkStudentNumberExists(
					editedUser.studentnumber.toString(),
					token,
				);
				if (exists) {
					isStudentNumberTakenRef.current = true;
				} else {
					isStudentNumberTakenRef.current = false;
				}
			}
		};
		if (editedUser.studentnumber) {
			checkStudentNumber();
		}
	}, [editedUser.studentnumber, originalStudentNumber]);
	useEffect(() => {
		const getStudentGroups = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const fetchedStudentGroups = await apihooks.fetchStudentGroups(token);

			setStudentGroups(fetchedStudentGroups);
		};
		getStudentGroups();
	}, []);

	return (
		<div className="flex flex-col md:space-x-4 justify-center items-center">
			<h1 className="text-2xl font-bold mb-4">Edit User {editedUser.userid}</h1>
			<div className="w-full md:w-1/2 p-4">
				{editedUser.last_name && (
					<label className="block mt-4">
						<span className="text-gray-700">Last Name</span>
						<input
							required={!!editedUser.last_name}
							type="text"
							name="last_name"
							value={editedUser.last_name}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.first_name && (
					<label className="block">
						<span className="text-gray-700">First Name</span>
						<input
							required={!!editedUser.first_name}
							type="text"
							name="first_name"
							value={editedUser.first_name}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}

				{editedUser.email && (
					<label className="block mt-4">
						<span className="text-gray-700">Email</span>
						<input
							required={!!editedUser.email}
							type="email"
							name="email"
							value={editedUser.email}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.username && (
					<label className="block mt-4">
						<span className="text-gray-700">Username</span>
						<input
							required={!!editedUser.username}
							type="text"
							name="username"
							value={editedUser.username}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{roles.length > 0 && (
					<label className="block mt-4">
						<span className="text-gray-700">Role</span>
						<select
							required={!!editedUser.roleid}
							name="roleid"
							value={editedUser.roleid}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							{roles.map(role => (
								<option key={role.roleid} value={role.roleid}>
									{role.name}
								</option>
							))}
						</select>
					</label>
				)}

				{editedUser.GDPR !== undefined && (
					<label className="block mt-4">
						<span className="text-gray-700">GDPR</span>
						<select
							required={editedUser.GDPR !== undefined}
							name="GDPR"
							value={editedUser.GDPR}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
							<option value={0}>Not Accepted</option>
							<option value={1}>Accepted</option>
						</select>
					</label>
				)}

				{editedUser.studentnumber !== undefined && (
					<label className="block">
						<span className="text-gray-700">Student Number</span>
						<input
							type="number"
							name="studentnumber"
							value={editedUser.studentnumber}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
						{isStudentNumberTakenRef.current && (
							<span className="text-red-500">Student number taken</span>
						)}
					</label>
				)}

				{studentGroups.length > 0 && (
					<label className="block mt-4">
						<span className="text-gray-700">Student Group</span>
						<select
							required={!!editedUser.studentgroupid}
							name="studentgroupid"
							value={editedUser.studentgroupid}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						>
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
				)}
				<button
					onClick={handleSaveClick}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default EditUserView;
