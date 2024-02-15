import React from 'react';

const AdminGuide = () => {
	return (
		<div className="p-4 md:p-8 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl md:text-3xl font-bold mb-4">Guide</h2>
			<p className="text-sm md:text-base mb-4">
				This is the guide for administrators. It provides instructions and
				information on how to navigate and utilize the various features of the admin
				dashboard.
			</p>
			<ul className="list-disc list-inside space-y-2">
				<li className="text-sm md:text-base">
					<strong>Statistics:</strong> This section provides statistical data and
					analysis relevant to the system's performance and user interactions.
				</li>
				<li className="text-sm md:text-base">
					<strong>Logs:</strong> Here, administrators can view detailed logs of
					system activities, including user actions, errors, and other important
					events.
				</li>
				<li className="text-sm md:text-base">
					<strong>Error Logs:</strong> This area displays logs specifically related
					to errors encountered within the system, aiding in troubleshooting and
					debugging.
				</li>
				<li className="text-sm md:text-base">
					<strong>User Feedback:</strong> Administrators can access and review
					feedback submitted by users, helping to understand user experiences and
					address any issues or concerns.
				</li>
			</ul>
		</div>
	);
};

export default AdminGuide;
