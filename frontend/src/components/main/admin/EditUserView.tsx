import React, {useEffect, useState} from 'react';
import apihooks from '../../../hooks/ApiHooks';
interface User {
	userid: string;
	username: string | null;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
	created_at: string;
	studentnumber: number;
	studentgroupid: number;
	roleid: number;
	GDPR: number;
	role: string;
}
interface EditUserViewProps {
	user: User;
	onSave: (user: User) => void;
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

/**
 * @typedef {Object} EditUserViewProps
 * @property {Object} user - The user object.
 * @property {Function} onSave - The function to call when the save button is clicked.
 */

/**
 * @typedef {Object} StudentGroup
 * @property {number} studentgroupid - The ID of the student group.
 * @property {string} group_name - The name of the student group.
 */

/**
 * @typedef {Object} Role
 * @property {number} roleid - The ID of the role.
 * @property {string} name - The name of the role.
 */
/**
 * The EditUserView component allows the user to edit a user's details.
 * @param {EditUserViewProps} props - The props.
 */
const EditUserView: React.FC<EditUserViewProps> = ({user, onSave}) => {
	// State for the edited user, roles, student groups, and whether the student number is taken
	const [editedUser, setEditedUser] = useState(user);
	const [roles, setRoles] = useState<Role[]>([]);
	const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
	const [isStudentNumberTaken, setIsStudentNumberTaken] = useState(false);
	// State for the original student number and timeout ID
	const [originalStudentNumber] = useState(user.studentnumber);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	/**
	 * Handles changes to the input fields.
	 * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - The change event.
	 */
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

	/**
	 * Handles the click event of the save button.
	 */
	const handleSaveClick = () => {
		onSave(editedUser);
	};
	// Fetch all roles when the component mounts
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

	// Check if the student number exists when it changes
	useEffect(() => {
		const checkStudentNumber = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			// Only check if the student number has changed from the original
			if (editedUser.studentnumber !== originalStudentNumber) {
				const response = await apihooks.checkStudentNumberExists(
					editedUser.studentnumber.toString(),
					token,
				);

				if (response.exists) {
					setIsStudentNumberTaken(true);
				} else {
					setIsStudentNumberTaken(false);
				}
			}
			console.log(
				'checkStudentNumber ' +
					editedUser.studentnumber +
					' ' +
					originalStudentNumber,
			);
			if (Number(editedUser.studentnumber) === Number(originalStudentNumber)) {
				setIsStudentNumberTaken(false);
			}
		};

		if (editedUser.studentnumber) {
			// If there is a previous timeout, clear it
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Start a new timeout
			const newTimeoutId = setTimeout(() => {
				checkStudentNumber();
			}, 500); // 500ms delay

			// Save the timeout ID so it can be cleared if the student number changes
			setTimeoutId(newTimeoutId);
		}
	}, [editedUser.studentnumber, originalStudentNumber]);

	// Fetch all student groups when the component mounts
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

	// render the component
	return (
		<div className="flex bg-white w-fit flex-col p-5 rounded-lg justify-center items-center">
			<h1 className="text-2xl font-bold mb-4">Edit User {editedUser.userid}</h1>
			<div className="w-full w-full p-4">
				{editedUser.last_name && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Last Name</span>
						<input
							required={!!editedUser.last_name}
							type="text"
							name="last_name"
							value={editedUser.last_name}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}
				{editedUser.first_name && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">First Name</span>
						<input
							required={!!editedUser.first_name}
							type="text"
							name="first_name"
							value={editedUser.first_name}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}

				{editedUser.email && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Email</span>
						<input
							required={!!editedUser.email}
							type="email"
							name="email"
							value={editedUser.email}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}
				{editedUser.username && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Username</span>
						<input
							required={!!editedUser.username}
							type="text"
							name="username"
							value={editedUser.username}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}
				{roles.length > 0 && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Role</span>
						<select
							required={!!editedUser.roleid}
							name="roleid"
							value={editedUser.roleid}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
						<span className="text-gray-700 font-bold">GDPR</span>
						<select
							required={editedUser.GDPR !== undefined}
							name="GDPR"
							value={editedUser.GDPR}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						>
							<option value={0}>Not Accepted</option>
							<option value={1}>Accepted</option>
						</select>
					</label>
				)}

				{editedUser.studentnumber !== undefined &&
					editedUser.studentnumber !== null && (
						<label className="block mt-4">
							<span className="text-gray-700 font-bold">Student Number</span>
							<input
								type="number"
								name="studentnumber"
								value={editedUser.studentnumber}
								onChange={handleInputChange}
								className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							/>
							{isStudentNumberTaken && (
								<span className="text-red-500">Student number taken</span>
							)}
						</label>
					)}

				{editedUser.studentgroupid !== undefined &&
					editedUser.studentgroupid !== null && (
						<label className="block mt-4">
							<span className="text-gray-700 font-bold">Student Group</span>
							<select
								required={!!editedUser.studentgroupid}
								name="studentgroupid"
								value={editedUser.studentgroupid}
								onChange={handleInputChange}
								className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
				<div className="text-center">
				<button
					onClick={handleSaveClick}
					className="mt-4 px-4 w-[10em] py-2 bg-metropoliaMainOrange hover:bg-metropoliaSecondaryOrange text-white rounded-md"
				>
					Save
				</button>
				</div>
			</div>
		</div>
	);
};

export default EditUserView;
