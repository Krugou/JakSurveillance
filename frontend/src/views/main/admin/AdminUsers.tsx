import SortIcon from '@mui/icons-material/Sort';
import {CircularProgress, IconButton} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import InputField from '../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';

const AdminUsers: React.FC = () => {
	const {user} = useContext(UserContext);
	const [users, setUsers] = useState<any[]>([]);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortKey, setSortKey] = useState('last_name');
	const [isLoading, setIsLoading] = useState(true);
	const sortedUsers = [...users].sort((a, b) => {
		if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
		if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
		return 0;
	});
	const sortUsers = (key: string) => {
		setSortKey(key);
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
	};
	const filteredUsers = sortedUsers.filter(user =>
		Object.values(user).some(
			value =>
				typeof value === 'string' &&
				value.toLowerCase().includes(searchTerm.toLowerCase()),
		),
	);
	const navigate = useNavigate();
	useEffect(() => {
		if (user) {
			setIsLoading(true);
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			// Create an async function inside the effect
			const fetchUsers = async () => {
				const fetchedUsers = await apiHooks.fetchUsers(token);
				setUsers(fetchedUsers);
				setIsLoading(false);
			};

			// Call the async function
			fetchUsers();
		}
	}, [user]);
	return (
		<div className="relative">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<CircularProgress />
				</div>
			) : users.length === 0 ? (
				<div className="flex justify-center items-center h-full">
					<p>No users available</p>
				</div>
			) : (
				<>
					<div className="w-1/4 m-4 p-4">
						<InputField
							type="text"
							name="search"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search..."
							label="Search"
						/>
					</div>
					<div className="h-1/2 relative overflow-x-scroll">
						<div className="max-h-96 h-96 overflow-y-scroll relative">
							<table className="table-auto w-full">
								<thead className="sticky top-0 bg-white z-10">
									<tr>
										{[
											'last_name',
											'email',
											'username',
											'first_name',
											'role',
											'studentnumber',
										].map((key, index) => (
											<th key={index} className="px-4 py-2">
												{key}
												<IconButton onClick={() => sortUsers(key)}>
													<SortIcon />
												</IconButton>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map(
										(user: Record<string, string | number>, index: number) => (
											<tr
												key={index}
												onClick={() => navigate(`/admin/users/${user.userid}`)}
												className="cursor-pointer hover:bg-gray-200"
											>
												{[
													'last_name',
													'email',
													'username',
													'first_name',
													'role',
													'studentnumber',
												].map((key, innerIndex) => (
													<td key={innerIndex} className="border px-2 py-2">
														{user[key]}
													</td>
												))}
											</tr>
										),
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AdminUsers;
