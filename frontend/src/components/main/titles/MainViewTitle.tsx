import React from 'react';

/**
 * MainViewTitleProps interface represents the structure of the MainViewTitle props.
 * It includes a property for the user's role.
 */
interface MainViewTitleProps {
	role: string;
}

/**
 * MainViewTitle component.
 * This component is responsible for displaying the title of the main view.
 * It uses the role prop to determine the user's role and displays it in the title.
 * The title is styled with various Tailwind CSS classes.
 *
 * @param {MainViewTitleProps} props The props that define the user's role.
 * @returns {JSX.Element} The rendered MainViewTitle component.
 */
const MainViewTitle: React.FC<MainViewTitleProps> = ({role}) => {
	return (
		<h1 className="text-2xl md:text-4xl bg-white p-3 rounded-xl w-fit mr-auto ml-auto text-center font-bold text-metropoliaSupportBlack mb-5 mt-5">
			{role} Dashboard
		</h1>
	);
};

export default MainViewTitle;
