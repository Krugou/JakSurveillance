import React from 'react';

interface SimpleUserViewProps {
	user: {
		role: string;
		first_name: string;
		last_name: string;
		email: string;
		studentnumber: string;
		userid: string;
	};
}

const SimpleUserView: React.FC<SimpleUserViewProps> = ({user}) => {
	return (
		<>
			<h1 className="text-2xl font-bold mb-4">{user.role}</h1>
			<div className="w-full md:w-1/2 p-4">
				{user.first_name && (
					<p className="mb-2 text-lg font-bold">First Name: {user.first_name}</p>
				)}
				{user.last_name && (
					<p className="mb-2 text-lg font-bold">Last Name: {user.last_name}</p>
				)}
				{user.email && (
					<p className="mb-2 text-lg font-bold">Email: {user.email}</p>
				)}
			</div>
			<div className="w-full md:w-1/2 p-4">
				{user.studentnumber && (
					<p className="mb-2 text-lg font-bold">
						Student Number: {user.studentnumber}
					</p>
				)}
				{user.userid && (
					<p className="mb-2 text-lg font-bold">User ID: {user.userid}</p>
				)}
			</div>
		</>
	);
};

export default SimpleUserView;
