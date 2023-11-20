import React from 'react';

interface ProfileInfoPros {
	user: {
		username: string;
		email: string;
		role: string;
		created_at: string;
	};
}

const ProfileInfo: React.FC<ProfileInfoPros> = ({user}) => {
	return (
		<>
			<p className="mb-5">
				<strong>Name:</strong> <span className="profileStat">{user.username}</span>
			</p>
			<p className="mb-5">
				<strong>Email:</strong> <span className="profileStat">{user.email}</span>
			</p>
			<p className="mb-5">
				<strong>Role:</strong> <span className="profileStat">{user.role}</span>
			</p>
			<p className="mb-5">
				<strong>Account created:</strong>{' '}
				<span className="profileStat">
					{new Date(user.created_at).toLocaleDateString()}
				</span>
			</p>
		</>
	);
};

export default ProfileInfo;
