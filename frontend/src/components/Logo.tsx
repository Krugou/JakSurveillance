import React from 'react';

const Logo = () => {
	return (
		<>
			<div className="logo">
				<div className="rounded-shape">
					<div className="eye left-eye"></div>
					<div className="eye right-eye"></div>
					<div className="eyebrow left-eyebrow"></div>
					<div className="eyebrow right-eyebrow"></div>
					<div className="horn left-horn"></div>
					<div className="horn right-horn"></div>
					<div className="mouth"></div>
					<div className="nose"></div>
					
				</div>
			</div>
			<p className="text-4xl m-2 p-2 font-bold text-center tracking-widest subpixel-antialiased ">
				JakSec
			</p>
		</>
	);
};

export default Logo;
