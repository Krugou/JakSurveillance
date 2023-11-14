import React, { ReactNode, useState, useEffect } from 'react';

interface BackgroundContainerProps {
    children: ReactNode;
}

const getRandomBackgroundUrl = (): string => {
    const randomNumber = Math.floor(Math.random() * 5) + 1; // Change 5 to the total number of backgrounds
    return `../../src/assets/images/tausta${randomNumber}.png`;
};

const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ children }) => {
    const [backgroundUrl, setBackgroundUrl] = useState<string>('');

    useEffect(() => {
        const url = getRandomBackgroundUrl();
        console.log('Background URL:', url);
        setBackgroundUrl(url);
    }, []); // The empty dependency array ensures this effect runs only once on mount

    return (
        <div
            className="flex flex-col pt-10 pb-10 pl-3 pr-3 items-center"
            style={{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundContainer;
