import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import AdminLogsTable from '../../../components/main/admin/AdminLogsTable';
import apiHooks from '../../../hooks/ApiHooks';

const AdminErrorLogs = () => {
  const [lineLimit, setLineLimit] = useState(100);
  const [errorLogs, setErrorLogs] = useState<
    {lineNumber: number; line: string}[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const getLogs = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('No token available');
        setIsLoading(false);
        return;
      }

      try {
        let errorLogsResult = await apiHooks.fetchErrorLogs(token, lineLimit);

        if (!Array.isArray(errorLogsResult)) {
          toast.error('Expected an array from fetchLogs and fetchErrorLogs');
          setIsLoading(false);
          return;
        }

        errorLogsResult = errorLogsResult.filter(
          (log) => log.line.trim() !== '',
        );

        setErrorLogs(errorLogsResult.reverse());
      } catch (error) {
        toast.error('Error fetching logs');
      }

      setIsLoading(false);
    };

    // Wait for 2 seconds before fetching logs
    const timeoutId = setTimeout(getLogs, 500);
    // Then fetch logs every 2 minutes
    const intervalId = setInterval(getLogs, 2 * 60 * 1000);
    // Clear the timeout if the component is unmounted or lineLimit changes
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [lineLimit, trigger]);
  const handleShowMore = () => {
    if (lineLimit < 500) {
      setIsLoading(true);
      setLineLimit(lineLimit + 100);
    }
  };

  const handleReset = () => {
    setLineLimit(100);
    setTrigger((prevTrigger) => prevTrigger + 1);
  };
  return (
    <div className='w-full p-4 m-1 bg-white'>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <div className='w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin'></div>
        </div>
      ) : (
        <div className='flex flex-col justify-center px-4 md:px-0'>
          <h1 className='mb-4 text-2xl font-bold text-center'>
            Admin Error Logs
          </h1>
          <div className='flex flex-col items-center justify-center w-full p-2 mb-4 bg-metropoliaSupportWhite md:mb-0'>
            <div className='flex flex-col items-center justify-center md:flex-row'>
              <button
                onClick={handleShowMore}
                className={`m-4 font-bold py-2 px-4 rounded ${
                  lineLimit >= 500
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-700 text-white'
                }`}
                disabled={lineLimit >= 5000}>
                Show older error Logs:
              </button>
              <button
                onClick={handleReset}
                className='px-4 py-2 m-2 font-bold text-white bg-red-500 rounded hover:bg-red-700'>
                Reset/Reload
              </button>
            </div>
          </div>
          {errorLogs.length === 0 ? (
        <p className='text-center text-gray-500'>No error logs available.</p>
      ) : (
        <AdminLogsTable logs={errorLogs} />
      )}
        </div>
      )}
    </div>
  );
};

export default AdminErrorLogs;
