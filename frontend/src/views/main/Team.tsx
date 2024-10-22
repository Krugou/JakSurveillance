import React from 'react';

const Team: React.FC = () => {
  return (
    <div className='flex flex-col items-center p-4 m-4 bg-white border-2 border-gray-200 rounded-md shadow-lg justify-evenly h-1/2'>
      <h1 className='mb-4 text-4xl font-bold text-metropoliaMainOrange'>
        Development Team
      </h1>
      <h1 className='mb-4 text-3xl font-semibold text-gray-700'>
        Joonas Lamminmäki. Aleksi Nokelainen. Kaarle Häyhä.
      </h1>
      <h2 className='mb-4 text-2xl text-gray-500'>JAKSEC</h2>
    </div>
  );
};

export default Team;
