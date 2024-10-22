import WarningIcon from '@mui/icons-material/Warning';
import {CircularProgress} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
import {useCourses} from '../../../../hooks/courseHooks';
/**
 * Student interface.
 * This interface defines the shape of a Student object.
 */
interface Student {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  studentnumber: number;
  roleid: number;
  studentgroupid: number;
  created_at: string;
  userid: number;
  group_name: string;
}
/**
 * SelectedCourse interface.
 * This interface defines the shape of a SelectedCourse object.
 */
interface SelectedCourse {
  name: string;
  code: string;
  courseid: string;
  start_date: string;
  end_date: string;
  studentgroup_name: string;
  topic_names: string;
  selected_topics: string;
  created_at: string;
}
/**
 * TeacherStudentsView component.
 * This component is responsible for rendering the view for a teacher to see their students.
 * It fetches the students taught by the teacher and allows the teacher to filter the students by course and search term.
 */
const TeacherStudentsView: React.FC = () => {
  const {user} = useContext(UserContext);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const {courses} = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(
    null,
  );

  // Fetch all students on mount
  useEffect(() => {
    const token: string | null = localStorage.getItem('userToken');

    if (!token) {
      toast.error('No token available');
      throw new Error('No token available');
    }

    const fetchStudents = async () => {
      if (user?.role === 'teacher') {
        const students = await apiHooks.getStudentsByInstructorId(
          user?.userid,
          token,
        );
        setAllStudents(students);
        setLoading(false);
      }

      if (user?.role === 'counselor') {
        const students = await apiHooks.fetchAllStudents(token);
        setAllStudents(students);
        setLoading(false);
      }
      if (user?.role === 'admin') {
        const students = await apiHooks.fetchAllStudents(token);
        setAllStudents(students);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  // If loading, show loading spinner
  if (loading) {
    return <CircularProgress />;
  }

  // Filter students based on search term and selected course
  const filteredStudents = (selectedCourse ? students : allStudents).filter(
    (student) =>
      Object.values(student).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // This function is called when a course is selected
  const handleCourseSelect = async (value: string) => {
    if (!courses) {
      toast.error('Courses not loaded');
      return;
    }
    // Find the selected course from the courses array
    const selected = courses.find(
      (course: SelectedCourse) => `${course.name} ${course.code}` === value,
    ) as SelectedCourse | undefined;

    setSelectedCourse(selected || null);

    // If the selected course is found, fetch the course details
    if (selected) {
      try {
        const token: string | null = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token available');
        }
        const students = await apiHooks.getStudentsByCourseId(
          selected.courseid,
          token,
        );
        console.log(students, 'students');
        setStudents(students);
      } catch (error) {
        toast.error('Error fetching course details');
        console.log(error);
      }
    }
  };

  return (
    <div className='w-full mx-auto 2xl:w-9/12'>
      <div className='flex flex-col items-center gap-5 sm:gap-0 sm:flex-row'>
        <h1 className='p-3 mb-4 ml-auto mr-auto text-2xl font-bold text-center bg-white rounded-lg w-fit'>
          Your Students
        </h1>
      </div>
      <div className='w-full max-h-[40em] 2xl:max-h-[60em] overflow-y-scroll rounded-xl bg-gray-100 p-2 sm:p-5'>
        <div className='ml-0 lg:ml-4'>
          <GeneralLinkButton
            path={
              user?.role === 'admin'
                ? '/counselor/mainview'
                : `/${user?.role}/mainview`
            }
            text='Back to mainview'
          />
        </div>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='w-8/12 sm:w-[15em] mt-5 lg:ml-4 ml-0 mb-4'>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label='Search by name'
              className='bg-white'
            />
          </div>

          <Autocomplete
            className='sm:w-[15em] w-10/12 mr-0 md:mr-4'
            freeSolo
            options={courses.map(
              (course: SelectedCourse) => `${course.name} ${course.code}`,
            )}
            onChange={(_, value) => handleCourseSelect(value as string)}
            value={
              selectedCourse
                ? `${selectedCourse.name} ${selectedCourse.code}`
                : null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label='Search By course'
                margin='normal'
                variant='outlined'
                className='bg-white'
              />
            )}
          />
        </div>
        <p className='flex items-center p-4 text-lg text-yellow-600'>
          <WarningIcon fontSize='large' />
          <span className='ml-2'>
            {selectedCourse
              ? 'Searching only from students on the selected course.'
              : 'Searching from all students.'}
          </span>
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {filteredStudents.map((student) => (
            <Link
              key={student.userid}
              to={
                user?.role === 'admin'
                  ? `/counselor/students/${student.userid}`
                  : `/${user?.role}/students/${student.userid}`
              }
              className='max-w-full mx-1 mb-4 transition duration-300 bg-white rounded shadow-lg lg:mx-2 xl:mx-4 w-12/12 hover:bg-gray-200'>
              <div className='flex flex-col px-4 py-2 text-sm lg:px-4 lg:py-4 md:text-base'>
                <div className='mb-2 text-lg font-bold underline underline-offset-8 decoration-metropoliaMainOrange'>
                  {student.first_name} {student.last_name}
                </div>
                {student.email && <p>Email: </p>}
                <p className='break-all'>{student.email}</p>
                <div className='flex flex-col gap-3 mt-3'>
                  {student.username && <p>Username: {student.username}</p>}
                  {student.studentnumber && (
                    <p>Student Number: {student.studentnumber}</p>
                  )}
                  {student.group_name && (
                    <p>Student Group: {student.group_name}</p>
                  )}
                  {student.created_at && (
                    <p>
                      Account created:{' '}
                      {new Date(student.created_at).toLocaleString()}
                    </p>
                  )}
                  <div className='flex flex-wrap items-center justify-between p-2'>
                    <p className='text-blue-500'>Click for details</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsView;
