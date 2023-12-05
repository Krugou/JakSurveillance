import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../hooks/ApiHooks'; // Replace with the correct path to your ApiHooks file

interface ProfileInfoPros {
	user: {
		username: string;
		email: string;
		role: string;
		created_at: string;
		first_name: string;
		last_name: string;
	};
}

// Define Role interface
interface Role {
	roleid: string;
	name: string;
}

const ProfileInfo: React.FC<ProfileInfoPros> = ({user}) => {
	// Define navigate
	const Navigate = useNavigate();
	// Define state variables for the modal
	const [open, setOpen] = useState(false);
	// Define state variables for the roles
	const [roles, setRoles] = useState<Role[]>([]);
	// Define state variable for the selected role
	const [selectedRole, setSelectedRole] = useState('');

	// Fetch the roles when the component is mounted
	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const fetchRoles = async () => {
			const roles = await apiHooks.fetchAllRolesSpecial(token);
			setRoles(roles);
			setSelectedRole(roles[0]?.roleid || '');
		};
		fetchRoles();
	}, []);

	const handleOpen = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Handle the role change
	const handleRoleChange = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		try {
			// Call the API to change the role
			const response = await apiHooks.changeRoleId(
				user.email,
				selectedRole,
				token,
			);
			if (!response.ok) {
				toast.error(response.error);
			}

			toast.success(response.message + ' please log in again');
			Navigate('/logout');
			handleClose();
		} catch (error) {
			toast.error((error as Error).toString());
			console.error('Failed to change role:', error);
			// handle the error appropriately, e.g., show a message to the user
		}
	};

	return (
		<div className="space-y-5">
			<p className="flex items-center gap-2">
				<strong>Name:</strong>{' '}
				<span className="profileStat">
					{user.first_name + ' ' + user.last_name}
				</span>
			</p>
			<p className="flex items-center gap-2">
				<strong>Username:</strong>{' '}
				<span className="profileStat">{user.username}</span>
			</p>
			<p className="flex flex-wrap items-base items-center gap-1">
				<strong>Email:</strong> <span className="profileStat w-fit">{user.email}</span>
			</p>
			<p className="flex items-center gap-2 mt-5">
				<strong>Account created:</strong>{' '}
				<span className="profileStat">
					{new Date(user.created_at).toLocaleDateString()}
				</span>
			</p>
			<p className="flex items-center gap-2">
				<strong>Role:</strong> <span className="profileStat">{user.role}</span>
				{['counselor', 'teacher'].includes(user.role) && (
					<button
						className="bg-metropoliaMainGrey transition hover:bg-metropoliaTrendLightBlue text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
						onClick={handleOpen}
					>
						Change
					</button>
				)}
			</p>

			{open && ['counselor', 'teacher'].includes(user.role) && (
				<div className="mt-5 border-y-4 border-metropoliaMainOrange pt-7 pb-10">
					<h2 className="text-2xl font-bold mb-3">Change Role</h2>
					<select
						title="Role Selection" // Add title attribute here
						className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						value={selectedRole}
						onChange={e => setSelectedRole(e.target.value)}
					>
						{roles.map(role => (
							<option value={role.roleid}>{role.name}</option>
						))}
					</select>
					<div className="mt-5 flex justify-between gap-10">
						<button
							type="button" // Add type attribute here
							className="bg-red-500 hover:bg-red-700 sm:text-lg transition text-sm text-white font-bold sm:py-2 sm:px-4 py-1 px-2 rounded"
							onClick={handleClose}
						>
							Cancel
						</button>
						<button
							type="button" // Add type attribute here
							className="bg-green-500 hover:bg-green-700 transition sm:text-lg text-sm text-white font-bold sm:py-2 sm:px-4 py-1 px-2 rounded"
							onClick={handleRoleChange}
						>
							Change Role
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileInfo;
