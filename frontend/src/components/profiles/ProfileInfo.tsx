import React, {useEffect, useState} from 'react';
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
		setOpen(true);
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
		// Call the API to change the role
		await apiHooks.changeRoleId(user.email, selectedRole, token);
		handleClose();
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
			<p className="flex items-center gap-2">
				<strong>Email:</strong> <span className="profileStat">{user.email}</span>
			</p>
			<p className="flex items-center gap-2">
				<strong>Role:</strong> <span className="profileStat">{user.role}</span>
				{['counselor', 'teacher'].includes(user.role) && (
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={handleOpen}
					>
						Change
					</button>
				)}
			</p>
			<p className="flex items-center gap-2">
				<strong>Account created:</strong>{' '}
				<span className="profileStat">
					{new Date(user.created_at).toLocaleDateString()}
				</span>
			</p>

			{open && ['counselor', 'teacher'].includes(user.role) && (
				<div className="mt-5">
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
					<div className="mt-5 flex gap-10">
						<button
							type="button" // Add type attribute here
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={handleClose}
						>
							Cancel
						</button>
						<button
							type="button" // Add type attribute here
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
