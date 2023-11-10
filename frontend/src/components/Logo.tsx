import React from 'react';
import '../css/logo.css';
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
