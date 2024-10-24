import CircularProgress from '@mui/material/CircularProgress';
import {
  BarElement,
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import React, {useEffect, useState} from 'react';
import {Bar, Pie, Line} from 'react-chartjs-2';
import {toast} from 'react-toastify';
import LecturesByDayChart from '../../../components/main/admin/LecturesByDayChart';
import apiHooks from '../../../hooks/ApiHooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

interface RoleCount {
  role_name: string;
  user_count: number;
}

interface LectureAttendanceCount {
  [key: string]: number;
}

interface Lecture {
  lectureid: number;
  start_date: string;
  attended: number;
  notattended: number;
  teacheremail: string;
  timeofday: string;
  coursename: string;
  state: string;
  topicname: string;
  coursecode: string;
  courseid: string;
  actualStudentCount: number;
}

interface MonthlyAttendance {
  month: string;
  attendance: number;
}

interface CourseAttendance {
  courseName: string;
  attendance: number;
}

const AdminStats = () => {
  const [userStatistics, setUserStatistics] = useState<{
    labels: string[];
    datasets: ChartDataset<'bar', number[]>[];
  } | null>(null);
  const [attendanceStatistics, setAttendanceStatistics] = useState<
    number[] | null
  >(null);
  const [lectureStatistics, setLectureStatistics] = useState<{
    labels: string[];
    datasets: ChartDataset<'bar', number[]>[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStatisticsPercentage, setUserStatisticsPercentage] =
    useState<number>(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [roleDistribution, setRoleDistribution] = useState<{
    labels: string[];
    datasets: ChartDataset<'pie', number[]>[];
  } | null>(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState<{
    labels: string[];
    datasets: ChartDataset<'line', number[]>[];
  } | null>(null);
  const [courseAttendance, setCourseAttendance] = useState<{
    labels: string[];
    datasets: ChartDataset<'bar', number[]>[];
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const fetchUserStatistics = async (token: string) => {
    const roleCounts: RoleCount[] = await apiHooks.getRoleCounts(token);
    console.log('🚀 ~ fetchUserStatistics ~ roleCounts:', roleCounts);
    const roleNames = roleCounts.map((row) => row.role_name);
    const userCounts = roleCounts.map((row) => row.user_count);
    const studentCount =
      roleCounts.find((row) => row.role_name === 'student')?.user_count || 0;
    const studentsLoggedCount =
      roleCounts.find((row) => row.role_name === 'StudentsLogged')
        ?.user_count || 0;
    const studentsLoggedPercentage = (studentsLoggedCount / studentCount) * 100;
    setUserStatisticsPercentage(studentsLoggedPercentage);
    setUserStatistics({
      labels: roleNames,
      datasets: [
        {
          label: 'User Counts',
          data: userCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          hidden: false,
        },
      ],
    });
    setRoleDistribution({
      labels: roleNames,
      datasets: [
        {
          label: 'User Role Distribution',
          data: userCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          hidden: false,
        },
      ],
    });
  };
  const [lectures, setLectures] = useState<Lecture[] | null>(null);

  const getLectures = async () => {
    const token: string | null = localStorage.getItem('userToken');
    if (!token) {
      toast.error('No token available');
      return false;
    }
    try {
      const result = await apiHooks.fetchAllLectures(token);
      if (!Array.isArray(result)) {
        toast.error('Expected an array from fetchAllLectures');
        return false;
      }

      setLectures(result);

      return true;
    } catch (error) {
      toast.error('Error fetching lectures');
      return false;
    }
  };

  useEffect(() => {
    getLectures();
  }, []);
  const fetchLectureStatistics = async (token: string) => {
    const lectureAttendanceCounts: LectureAttendanceCount =
      await apiHooks.getLectureAndAttendanceCount(token);
    const labels = Object.keys(lectureAttendanceCounts).map((label) => {
      if (label === 'notattended') {
        return 'Not Attended';
      }
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
    const data = Object.values(lectureAttendanceCounts) as number[];
    setAttendanceStatistics(data);
    setLectureStatistics({
      labels: labels,
      datasets: [
        {
          label: 'Attendance Counts',
          data: data,
          backgroundColor: 'rgba(255, 25, 2, 0.6)',
          hidden: false,
        },
      ],
    });
  };

  const fetchMonthlyAttendance = async (token: string) => {
    const monthlyAttendanceData: MonthlyAttendance[] =
      await apiHooks.getMonthlyAttendance(token);
    const labels = monthlyAttendanceData.map((row) => row.month);
    const data = monthlyAttendanceData.map((row) => row.attendance);
    setMonthlyAttendance({
      labels: labels,
      datasets: [
        {
          label: 'Monthly Attendance Trends',
          data: data,
          borderColor: 'rgba(75, 192, 192, 0.6)',
          fill: false,
          hidden: false,
        },
      ],
    });
  };

  const fetchCourseAttendance = async (token: string) => {
    const courseAttendanceData: CourseAttendance[] =
      await apiHooks.getCourseAttendance(token);
    const labels = courseAttendanceData.map((row) => row.courseName);
    const data = courseAttendanceData.map((row) => row.attendance);
    setCourseAttendance({
      labels: labels,
      datasets: [
        {
          label: 'Course-wise Attendance Comparison',
          data: data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          hidden: false,
        },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token: string | null = localStorage.getItem('userToken');
      if (!token) {
        setError('No token available');
        return;
      }

      try {
        await fetchUserStatistics(token);
        await fetchLectureStatistics(token);
        await fetchMonthlyAttendance(token);
        await fetchCourseAttendance(token);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userStatistics || !lectureStatistics || !roleDistribution || !monthlyAttendance || !courseAttendance) {
    return <CircularProgress />;
  }

  return (
    <div
      className='grid w-full grid-cols-1 gap-4 p-5 bg-white xl:grid-cols-2'
      key={windowWidth}>
      <h2 className='mb-4 text-2xl md:text-3xl col-span-full'>
        Administrator Statistics
      </h2>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>User Statistics</h2>
        <p className='text-sm md:text-base'>{`Percentage of students who have logged in at least once: ${userStatisticsPercentage.toFixed(
          2,
        )}%`}</p>
        <div className='w-full'>
          <Bar options={options} data={userStatistics} />
        </div>
      </div>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>Attendance Statistics</h2>
        {attendanceStatistics && (
          <p className='text-sm md:text-base'>
            {`Total lectures: ${attendanceStatistics[0]}. Attendance ratio: ${(
              (attendanceStatistics[2] /
                (attendanceStatistics[2] + attendanceStatistics[1])) *
              100
            ).toFixed(2)}%`}
          </p>
        )}
        <div className='w-full'>
          <Bar options={options} data={lectureStatistics} />
        </div>
      </div>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>
          Weekly Distribution of Saved Lectures Count by Day
        </h2>
        <div className='w-full'>
          <LecturesByDayChart lectures={lectures} />
        </div>
      </div>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>User Role Distribution</h2>
        <div className='w-full'>
          <Pie data={roleDistribution} />
        </div>
      </div>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>Monthly Attendance Trends</h2>
        <div className='w-full'>
          <Line data={monthlyAttendance} />
        </div>
      </div>
      <div className='justify-start w-full mx-4'>
        <h2 className='mb-4 text-xl md:text-2xl'>
          Course-wise Attendance Comparison
        </h2>
        <div className='w-full'>
          <Bar options={options} data={courseAttendance} />
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
