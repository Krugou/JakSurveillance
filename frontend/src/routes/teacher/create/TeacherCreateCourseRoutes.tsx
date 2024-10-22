import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CreateCourseCustom from '../../../components/main/course/CreateCourseCustom.tsx';
import CreateCourseEasy from '../../../components/main/course/CreateCourseEasy.tsx';
import TeacherCreateCourse from '../../../views/main/teacher/Courses/TeacherCreateCourse.tsx';
import TeacherMainView from '../../../views/main/teacher/TeacherMainView.tsx';
/**
 * TeacherCreateCourseRoutes component.
 * This component is responsible for defining the routes for the teacher's course creation section of the application.
 * It includes routes for the course creation view, easy course creation, custom course creation, and the main view.
 * Each route is associated with a specific component that will be rendered when the route is accessed.
 * The '*' route is a catch-all route that will render the TeacherMainView component if no other routes match.
 *
 * @returns {JSX.Element} The rendered TeacherCreateCourseRoutes component.
 */
const TeacherCreateCourseRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<TeacherCreateCourse />} />
      <Route path='easy' element={<CreateCourseEasy />} />
      <Route path='custom' element={<CreateCourseCustom />} />
      <Route path='*' element={<TeacherMainView />} />
    </Routes>
  );
};

export default TeacherCreateCourseRoutes;
