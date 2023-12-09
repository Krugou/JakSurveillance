import React from 'react';
import '../css/logo.css';
/**
 * Logo component.
 * This component is responsible for rendering the logo of the application.
 * It includes a div with class "logo" that contains the logo design, and a paragraph that contains the name of the application.
 * The logo design is made up of nested divs with various classes to apply the necessary CSS styles.
 * The name of the application is styled with various Tailwind CSS classes.
 *
 * @returns {JSX.Element} The rendered Logo component.
 */
const Logo = () => {
	return (
		<>
			<div className="logo m-4 p-2">
				<div className="oval-shape">
					<div className="big-brother-eye">
						<div className="eye"></div>
					</div>
				</div>
			</div>

			<p className="text-4xl m-2 p-2 font-bold text-center tracking-widest subpixel-antialiased">
				JakSec
			</p>
		</>
	);
};

export default Logo;
