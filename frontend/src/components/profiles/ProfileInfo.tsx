import React, {useEffect, useState} from 'react';
import apiHooks from '../../hooks/ApiHooks'; // Replace with the correct path to your ApiHooks file

interface ProfileInfoPros {
	user: {
		username: string;
		email: string;
		role: string;
		created_at: string;
	};
}

const ProfileInfo: React.FC<ProfileInfoPros> = ({user}) => {
	const [open, setOpen] = useState(false);
	const [roles, setRoles] = useState([]);
	const [selectedRole, setSelectedRole] = useState('');

	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const fetchRoles = async () => {
			const roles = await apiHooks.fetchAllRoles(token);
			setRoles(roles);
		};
		fetchRoles();
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleRoleChange = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		await apiHooks.changeRoleId(user.email, selectedRole, token);
		handleClose();
	};

	return (
		<div className="space-y-5">
			<p className="flex justify-between items-center">
				<strong>Name:</strong> <span className="profileStat">{user.username}</span>
			</p>
			<p className="flex justify-between items-center">
				<strong>Email:</strong> <span className="profileStat">{user.email}</span>
			</p>
			<p className="flex justify-between items-center">
				<strong>Role:</strong> <span className="profileStat">{user.role}</span>
			</p>
			<p className="flex justify-between items-center">
				<strong>Account created:</strong>{' '}
				<span className="profileStat">
					{new Date(user.created_at).toLocaleDateString()}
				</span>
			</p>
			{['counselor', 'teacher'].includes(user.role) && (
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={handleOpen}
				>
					Change Role
				</button>
			)}
			{open && ['counselor', 'teacher'].includes(user.role) && (
				<div className="mt-5">
					<h2 className="text-2xl font-bold mb-3">Change Role</h2>
					<select
						className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						value={selectedRole}
						onChange={e => setSelectedRole(e.target.value)}
					>
						{roles.map(role => (
							<option value={role.roleid}>{role.name}</option>
						))}
					</select>
					<div className="mt-5 flex justify-between">
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={handleClose}
						>
							Cancel
						</button>
						<button
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
