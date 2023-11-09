import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/JakSec.png';
import Logo from '../../components/Logo';
import StartViewButton from '../../components/main/buttons/StartViewButton';
import '../../../src/index.css';

const StartView = () => {
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e) => {
		setCursorPosition({ x: e.clientX, y: e.clientY });
	};

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	const calculateTransform = () => {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const centerX = screenWidth / 2;

		const horizontalSwingFactor = 10;
		const horizontalSwing = (centerX - cursorPosition.x) / centerX * horizontalSwingFactor;

		const verticalMovementFactor = 15;
		const verticalMovement = -(1 - cursorPosition.y / screenHeight) * verticalMovementFactor;

		return {
			rotation: horizontalSwing,
			verticalMovement,
		};
	};

	return (
		<div
			className="flex flex-col items-center justify-center logo-container border-metropoliaMainOrange border-t-4 pt-10"
		>
			<img
				style={{
					transform: `rotate(${calculateTransform().rotation}deg) translateY(${calculateTransform().verticalMovement}px)`,
				}}
				src={logo}
				alt="logo"
				className="w-auto sm:h-60 h-36 sm:mb-8 mb-0"
			/>
			<Logo />
			<div className="flex flex-col md:flex-row items-center m-4 p-4">
				<StartViewButton />
			</div>
		</div>
	);
};

export default StartView;
