import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-metropoliaMainOrange text-white py-4 px-8 text-center">
            <p className="mb-2">© {new Date().getFullYear()} Metropolia Attendance App</p>
            <p>Developed by JAK</p>
        </footer>
    );
};

export default Footer;