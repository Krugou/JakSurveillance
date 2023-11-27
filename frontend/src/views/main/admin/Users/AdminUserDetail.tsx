import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import SimpleUserView from '../../../../components/main/admin/SimpleUserView';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

const AdminUserDetail: React.FC = () => {
	const {userid} = useParams<{userid: string}>(); // Change the type to string
	const {user} = useContext(UserContext);
	const [fetchUser, setFetchUser] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			// Create an async function inside the effect
			const fetchUserData = async () => {
				const fetchedUser = await apiHooks.fetchUserById(Number(userid), token); // Convert userid to number
				setFetchUser(fetchedUser[0]);
				console.log(fetchedUser[0]);
			};

			// Call the async function
			fetchUserData();
		}
	}, [user, userid]);

	const handleEdit = () => {
		navigate(`./modify`);
	};

	return (
		fetchUser && (
			<div className="flex flex-col md:space-x-4 justify-center items-center">
				<SimpleUserView user={fetchUser} />
				<Button
					variant="contained"
					color="primary"
					startIcon={<EditIcon />}
					onClick={handleEdit}
				>
					Edit
				</Button>
			</div>
		)
	);
};

export default AdminUserDetail;
