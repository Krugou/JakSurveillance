import React from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';
/**
 * `buildDate` is the date when the application was built.
 */
const buildDate: Date = new Date(
  import.meta.env.VITE_REACT_APP_BUILD_DATE as string,
);

/**
 * `currentDate` is the current date.
 */
const currentDate: Date = new Date();

/**
 * `diffTime` is the difference in milliseconds between the current date and the build date.
 */
const diffTime: number = Math.abs(currentDate.getTime() - buildDate.getTime());

/**
 * `diffDays` is the number of full days since the build date.
 */
const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

/**
 * `diffHours` is the number of full hours past the last full day.
 */
const diffHours: number = Math.floor((diffTime / (1000 * 60 * 60)) % 24);

/**
 * `Footer` is a React functional component that renders the footer of the application.
 * It displays the copyright year, the developer's name, and the build date and time since build date in the title of the developer's name.
 */
const Footer: React.FC = () => {
  const {user} = React.useContext(UserContext);

  const buildInfo = `Build date: ${buildDate.toLocaleDateString()}${
    diffDays > 0 ? ` Time since build date: ${diffDays} days` : ''
  }${diffHours > 0 ? ` and ${diffHours} hours` : ''}`;
  return (
    <footer className='px-8 py-4 text-center text-white bg-metropoliaMainOrange'>
      <p className='mb-2'>
        © {new Date().getFullYear()} Metropolia Attendance App
      </p>
      <p title={buildInfo}>
        Developed by{' '}
        {user ? <Link to={`/${user?.role}/team`}>JAK</Link> : 'JAK'}
      </p>
      <a
        href='https://oma.metropolia.fi'
        target='_blank'
        rel='noopener noreferrer'>
        Oma
      </a>
    </footer>
  );
};

export default Footer;
