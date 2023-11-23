import {Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

const AdminUserDetail: React.FC = () => {
	const {userid} = useParams<{userid: number}>();
	const {user} = useContext(UserContext);
	const [fetchUser, setFetchUser] = useState<any[]>([]);

	useEffect(() => {
		if (user) {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			// Create an async function inside the effect
			const fetchUser = async () => {
				const fetchedUser = await apiHooks.fetchUserById(userid, token);
				setFetchUser(fetchedUser[0]);
				console.log(fetchedUser[0]);
			};

			// Call the async function
			fetchUser();
		}
	}, [user]);

	return (
		<div className="md:flex md:space-x-4">
			<div className="md:w-1/2">
				{fetchUser.first_name && (
					<Typography variant="h6">First Name: {fetchUser.first_name}</Typography>
				)}
				{fetchUser.last_name && (
					<Typography variant="h6">Last Name: {fetchUser.last_name}</Typography>
				)}
				{fetchUser.email && (
					<Typography variant="h6">Email: {fetchUser.email}</Typography>
				)}
			</div>
			<div className="md:w-1/2">
				{fetchUser.role && (
					<Typography variant="h6">Role: {fetchUser.role}</Typography>
				)}
				{fetchUser.studentnumber && (
					<Typography variant="h6">
						Student Number: {fetchUser.studentnumber}
					</Typography>
				)}
				{fetchUser.userid && (
					<Typography variant="h6">User ID: {fetchUser.userid}</Typography>
				)}
			</div>
		</div>
	);
};

export default AdminUserDetail;
