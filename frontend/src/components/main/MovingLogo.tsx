import React from 'react';
import metropoliaLogo from '../../assets/images/metropolia_s_musta_en.png';
import '../../css/logo.css';

const MovingLogo = () => (
	<div className="logo m-4 w-1/12 p-2 animate-pulse">
		<img className="" src={metropoliaLogo} alt="Metropolia Logo" />
	</div>
);

export default MovingLogo;
