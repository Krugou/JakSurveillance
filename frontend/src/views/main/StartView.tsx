import React from 'react';
import logo from '../../assets/images/JakSec.png';
import Logo from '../../components/Logo';
import StartViewButton from '../../components/main/buttons/StartViewButton';

const StartView = () => {
	return (
		<div className="flex flex-col items-center justify-center ">
			<img src={logo} alt="logo" className="w-auto sm:h-60 h-36  sm:mb-8 mb-0" />
			<Logo />
			<div className="flex flex-col md:flex-row items-center m-4 p-4">
				<StartViewButton />
			</div>
		</div>
	);
};

export default StartView;
