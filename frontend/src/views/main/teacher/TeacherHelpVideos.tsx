import React, { useState } from 'react';

const TeacherHelpVideos: React.FC = () => {
    const Dropdown: React.FC<{ title: string; src: string }> = ({ title, src }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className={`border p-2 rounded-md ${
                        isOpen ? 'bg-gray-100' : 'bg-white'
                    }`}
                >
          <span className="mr-2">
            {isOpen ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                    />
                </svg>
            )}
          </span>
                    {title}
                </button>
                {isOpen && (
                    <div className="w-full h-full bg-gray-800 p-4">
                        <video controls src={src} className="w-full h-full" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-4">Teacher Help Videos</h1>
            <div className="space-y-4">
                <Dropdown title="How do I create a course?" src="video-url-1.mp4" />
                <Dropdown title="How do I create an attendance?" src="video-url-2.mp4" />
            </div>
        </div>
    );
};

export default TeacherHelpVideos;
