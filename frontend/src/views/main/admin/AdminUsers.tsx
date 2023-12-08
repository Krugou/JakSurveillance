import SortIcon from '@mui/icons-material/Sort';
import {CircularProgress} from '@mui/material';
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
				// Filter out the current user
				const otherUsers = fetchedUsers.filter(
					fetchedUser => fetchedUser.userid !== user.userid,
				);
				setUsers(otherUsers);

				setIsLoading(false);
			};

			// Call the async function
			fetchUsers();
		}
	}, [user]);
	return (
		<div className="relative lg:w-fit w-full">
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
					<div className="lg:w-1/4 sm:w-[20em] w-1/2 mt-4 mb-4">
						<InputField
							type="text"
							name="search"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search..."
							label="Search"
						/>
					</div>
					<div className="relative bg-gray-100">
						<div className="relative max-h-96 h-96 overflow-y-scroll">
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
											'created_at',
										].map((key, index) => (
											<th key={index} className="px-4 py-2">
												{key}
												<button
													aria-label="Sort Column"
													className="ml-2 bg-metropoliaMainOrange text-sm text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-1"
													onClick={() => sortUsers(key)}
												>
													<SortIcon />
												</button>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map(
										(user: Record<string, string | number>, index: number) => (
											<tr
												key={index}
												onClick={() => navigate(`/admin/users/${user.userid}/modify`)}
												className="cursor-pointer hover:bg-gray-200"
											>
												{[
													'last_name',
													'email',
													'username',
													'first_name',
													'role',
													'studentnumber',
													'created_at',
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
