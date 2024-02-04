import React from 'react';

const Team: React.FC = () => {
	return (
		<div className="flex flex-col m-4 p-4 rounded-md items-center justify-evenly bg-white h-1/2 shadow-lg border-2 border-gray-200">
			<h1 className="text-4xl mb-4 text-metropoliaMainOrange font-bold">
				Development Team
			</h1>
			<h1 className="text-3xl mb-4 text-gray-700 font-semibold">
				Joonas. Aleksi. Kaarle.
			</h1>
			<h2 className="text-2xl mb-4 text-gray-500">JAKSEC</h2>
		</div>
	);
};

export default Team;
