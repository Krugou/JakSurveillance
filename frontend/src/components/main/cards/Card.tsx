import React from 'react';
import {useNavigate} from 'react-router-dom';
/**
 * Props for the Card component.
 */
interface CardProps {
  path: string;
  title: string;
  description: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({path, title, description, className}) => {
  const navigate = useNavigate();
  /**
   * Navigates to the specified path when the card is clicked.
   */
  const handleCardClick = () => {
    navigate(path);
  };
  /**
   * A card component that displays a title and description, and navigates to a specified path when clicked.
   */
  return (
    <div
      onClick={handleCardClick}
      className={`card-link m-3 cursor-pointer ${className?.toString()}`}>
      <div className='relative bg-white p-4 rounded-md shadow-md transition-transform transform hover:scale-105 group w-[15rem] h-[8rem]'>
        <h2 className='mb-2 text-lg font-semibold'>{title}</h2>
        <div className='absolute bottom-0 left-0 flex items-center justify-between w-full p-2 transition-opacity duration-300 ease-in-out opacity-0 h-1/2 bg-metropoliaMainOrange rounded-b-md sm:group-hover:opacity-100'>
          <p className='inline-block text-white'>{description}</p>
          <span className='inline-block ml-1 text-xl text-white'>&#8594;</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
