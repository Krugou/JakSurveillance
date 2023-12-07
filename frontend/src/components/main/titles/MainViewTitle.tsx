import React from 'react';

const MainViewTitle = ({role}) => {
	return (
		<h1 className="text-2xl md:text-4xl bg-white p-3 rounded-xl w-fit mr-auto ml-auto text-center font-bold text-metropoliaSupportBlack mb-5 mt-5">
			{role} Dashboard
		</h1>
	);
};

export default MainViewTitle;
