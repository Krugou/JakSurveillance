import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Login from './views/Login.tsx';
import StartView from './views/StartView.tsx';

const intervalMS = 60 * 60 * 1000;

const App = () => {





    // Define a function to handle the login action
    const handleLogin = (userType: string, userData: any) => {
        // Add your login logic here, e.g., make an API call to authenticate the user
        console.log(`User logged in as a ${userType}`);
        console.log(userData); // You can access user data here
    };

    useRegisterSW({
        onRegistered(r) {
            r && setInterval(() => {
                r.update();
            }, intervalMS);
        },
    });

    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<StartView />} />
                <Route path="/student-login" element={
                    <Login userType="Student" onLogin={(userData) => handleLogin("Student", userData)} />
                } />
                <Route path="/teacher-login" element={
                    <Login userType="Teacher" onLogin={(userData) => handleLogin("Teacher", userData)} />
                } />
            </Routes>

        </Router>
    );
};

export default App;