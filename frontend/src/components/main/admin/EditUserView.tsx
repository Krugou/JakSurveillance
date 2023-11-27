import React, {useState} from 'react';

interface EditUserViewProps {
	user: {
		role: string;
		first_name: string;
		last_name: string;
		email: string;
		studentnumber: string;
		userid: string;
		username: string;
		created_at: string;
		GDPR: number;
		roleid: number;
		staff: number;
		studentgroupid: number;
	};
}

const EditUserView: React.FC<EditUserViewProps> = ({user}) => {
	const [editedUser, setEditedUser] = useState(user);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEditedUser({
			...editedUser,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<div className="flex flex-col md:space-x-4 justify-center items-center">
			<h1 className="text-2xl font-bold mb-4">Edit User {editedUser.userid}</h1>
			<div className="w-full md:w-1/2 p-4">
				{editedUser.first_name && (
					<label className="block">
						<span className="text-gray-700">First Name</span>
						<input
							type="text"
							name="first_name"
							value={editedUser.first_name}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.last_name && (
					<label className="block mt-4">
						<span className="text-gray-700">Last Name</span>
						<input
							type="text"
							name="last_name"
							value={editedUser.last_name}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.email && (
					<label className="block mt-4">
						<span className="text-gray-700">Email</span>
						<input
							type="email"
							name="email"
							value={editedUser.email}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.username && (
					<label className="block mt-4">
						<span className="text-gray-700">Username</span>
						<input
							type="text"
							name="username"
							value={editedUser.username}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.role && (
					<label className="block mt-4">
						<span className="text-gray-700">Role</span>
						<input
							type="text"
							name="role"
							value={editedUser.role}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}

				{editedUser.GDPR !== undefined && (
					<label className="block mt-4">
						<span className="text-gray-700">GDPR</span>
						<input
							type="number"
							name="GDPR"
							value={editedUser.GDPR}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.roleid && (
					<label className="block mt-4">
						<span className="text-gray-700">Role ID</span>
						<input
							type="text"
							name="roleid"
							value={editedUser.roleid}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.studentnumber && (
					<label className="block">
						<span className="text-gray-700">Student Number</span>
						<input
							type="text"
							name="studentnumber"
							value={editedUser.studentnumber}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
				{editedUser.studentgroupid && (
					<label className="block mt-4">
						<span className="text-gray-700">Student Group ID</span>
						<input
							type="text"
							name="studentgroupid"
							value={editedUser.studentgroupid}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
						/>
					</label>
				)}
			</div>
		</div>
	);
};

export default EditUserView;
