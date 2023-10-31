import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import apiHooks from './hooks/ApiHooks.ts';
import AdminRoutes from './routes/AdminRoutes';
import CounselorRoutes from './routes/CounselorRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import Footer from './views/Footer.tsx';
import Header from './views/Header.tsx';
import StartView from './views/main/StartView.tsx';

const intervalMS = 60 * 60 * 1000;

const App = () => {
  // Define a function to handle the login action
  const handleLogin = async (
    userType: string,
    username: string,
    password: string
  ) => {
    // alert('login');
    console.log(userType, username, password);
    const inputs = { username, password };
    console.log('asdasdasdasd');

    try {
      const response = await apiHooks.postLogin(inputs);
      console.log(response, 'LOGIN RESPONSE');
    } catch (error) {
      console.log(error);
    }

    console.log('🚀 ~ file: App.tsx:41 ~ App ~ inputs:', inputs);
  };

  useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log('Service worker registered successfully');
        setInterval(() => {
          r.update();
        }, intervalMS);
      } else {
        console.log('Service worker registration failed');
      }
    },
  });

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Header title='Attendance App' />
      <main>
        <Routes>
          <Route path='/' element={<StartView />} />
          <Route
            path='student/*'
            element={<StudentRoutes handleLogin={handleLogin} />}
          />
          <Route
            path='admin/*'
            element={<AdminRoutes handleLogin={handleLogin} />}
          />
          <Route
            path='counselor/*'
            element={<CounselorRoutes handleLogin={handleLogin} />}
          />
          <Route
            path='teacher/*'
            element={<TeacherRoutes handleLogin={handleLogin} />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
