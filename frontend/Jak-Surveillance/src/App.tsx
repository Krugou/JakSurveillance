import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './views/Login';
import StartView from './views/StartView';

const App = () => {
    // Define a function to handle the login action
    const handleLogin = (userType: string, userData: any) => {
        // Add your login logic here, e.g., make an API call to authenticate the user
        console.log(`User logged in as a ${userType}`);
        console.log(userData); // You can access user data here
    };

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
