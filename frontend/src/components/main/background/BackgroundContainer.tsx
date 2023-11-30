import React, { ReactNode, useEffect, useState } from 'react';
import tausta1 from '../../../assets/images/tausta1.png';
import tausta2 from '../../../assets/images/tausta2.png';
import tausta3 from '../../../assets/images/tausta3.png';
import tausta4 from '../../../assets/images/tausta4.png';
import tausta5 from '../../../assets/images/tausta5.png';
import Footer from '../../../views/Footer';
import Header from '../../../views/Header';

interface BackgroundContainerProps {
	children: ReactNode;
}

const backgrounds = [tausta1, tausta2, tausta3, tausta4, tausta5];

const getRandomBackgroundUrl = (): string => {
	const randomNumber = Math.floor(Math.random() * backgrounds.length);
	return backgrounds[randomNumber];
};

const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ children }) => {
	const [backgroundUrl, setBackgroundUrl] = useState<string>('');

	useEffect(() => {
		const url = getRandomBackgroundUrl();
		setBackgroundUrl(url);
	}, []); // The empty dependency array ensures this effect runs only once on mount

	return (
		<div className="flex flex-col h-screen">
			<Header title="Attendance App" />
			<main
				className="flex-grow flex flex-col items-center p-10 bg-cover bg-center"
				style={{ backgroundImage: `url(${backgroundUrl})` }}
			>
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default BackgroundContainer;
