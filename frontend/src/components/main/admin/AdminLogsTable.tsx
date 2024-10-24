import React, {useState} from 'react';

interface Log {
  line: string;
}

interface AdminLogsTableProps {
  logs: Log[];
}

const AdminLogsTable: React.FC<AdminLogsTableProps> = ({logs}) => {
  return (
    <div className='flex flex-col items-center justify-center p-2 m-4'>
      <div className='overflow-x-auto'>
        <div className='overflow-auto flex flex-col gap-4 divide-y divide-gray-200 h-1/2'>
          {logs.map((log, index) => {
            try {
              const parsedLog = JSON.parse(log.line);
              return <LogItem key={index} parsedLog={parsedLog} />;
            } catch (error) {
              console.error(`Error parsing log line: ${log.line}`, error);
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

interface LogItemProps {
  parsedLog: {
    useremail?: string;
    time: string;
    msg: string;
  };
}

const LogItem: React.FC<LogItemProps> = ({parsedLog}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='flex flex-col justify-between p-1 text-black bg-white border rounded-lg shadow-lg transition-all duration-300 hover:bg-black hover:text-white'>
      <div className='flex justify-end'>
        {!isExpanded && (
          <div className='max-w-xs p-1 overflow-hidden text-xs text-left sm:text-sm md:text-base text-overflow-ellipsis sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'>
            {parsedLog.msg}
          </div>
        )}
        <button
          onClick={toggleExpand}
          className='mt-1 text-2xl border rounded-xl bg-metropoliaMainGrey w-8 h-8 shadow-md text-metropoliaMainOrange hover:underline transform transition-transform duration-300 hover:scale-110'>
          {isExpanded ? '<' : '>'}
        </button>
      </div>
      {isExpanded && (
        <div className='transition-all duration-300 ease-in-out'>
          <div className='max-w-xs p-1 overflow-hidden text-xs text-left sm:text-sm md:text-base text-overflow-ellipsis sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'>
            <strong>Message:</strong> {parsedLog.msg}
          </div>
          <div
            className={`flex ${
              parsedLog.useremail ? 'justify-between' : 'justify-end'
            }`}>
            {parsedLog.useremail && (
              <div className='p-1 text-sm'>
                <strong>User Email:</strong> {parsedLog.useremail}
              </div>
            )}
            <div className='mx-1 text-sm text-right whitespace-nowrap'>
              <strong>Time:</strong> {new Date(parsedLog.time).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogsTable;
