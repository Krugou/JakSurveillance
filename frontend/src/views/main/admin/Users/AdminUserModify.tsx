import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import EditUserView from '../../../../components/main/admin/EditUserView';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
interface User {
	userid: number;
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
const AdminUserModify: React.FC = () => {
	const {userid} = useParams<{userid: string}>(); // Change the type to string
	const {user} = useContext(UserContext);
	const [modifyUser, setModifyUser] = useState<User | null>(null);

	useEffect(() => {
		if (user) {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			// Create an async function inside the effect
			const ModifyUserData = async () => {
				try {
					const modifyUser = await apiHooks.fetchUserById(Number(userid), token);
					setModifyUser(modifyUser[0]);
					console.log(modifyUser[0]);
				} catch (error) {
					console.error('Failed to fetch user data:', error);
					// handle the error appropriately, e.g., show a message to the user
				}
			};

			// Call the async function
			ModifyUserData();
		}
	}, [user, userid]);
	const handleSave = async (editedUser: User) => {
		// Get token from local storage
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}

		try {
			const response = await apiHooks.updateUser(token, editedUser);
			toast.success(response.message);
		} catch (error) {
			toast.error('Failed to update user: ' + error.toString());
			// handle the error appropriately, e.g., show a message to the user
		}
	};

	return modifyUser && <EditUserView user={modifyUser} onSave={handleSave} />;
};

export default AdminUserModify;
