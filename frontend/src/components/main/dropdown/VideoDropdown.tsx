import React, { useState } from 'react';

interface VideoDropdownProps {
    title: string;
    src: string;
}

const VideoDropdown: React.FC<VideoDropdownProps> = ({ title, src }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="m-auto w-full sm:w-full md:w-3/4 xl:w-3/4 2xl:w-2/4">
            <button
                onClick={toggleDropdown}
                className={`border p-2 rounded-md flex items-center hover:bg-metropoliaSecondaryOrange text-white gap-4 m-auto ${
                    isOpen ? 'bg-metropoliaSecondaryOrange' : 'bg-metropoliaMainOrange'
                }`}
            >
                {title}
                <span className="mr-2">
          {isOpen ? (
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
          ) : (
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
          )}
        </span>
            </button>
            {isOpen && (
                <div className="w-full h-full m-auto mt-4">
                    <video controls src={src} className="w-full rounded h-full" />
                </div>
            )}
        </div>
    );
};

export default VideoDropdown;
