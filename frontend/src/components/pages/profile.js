import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ShiftLog from '../shiftLog';
import UserProfileCard from '../userProfileCard';
import TaskCard from '../taskCard';

export default function Profile() {
    // Declare variables
    const navigate = useNavigate();
    // Function to check if the user is authenticated
    function isAuthenticated() {
        return !!Cookies.get('username');
    }

    // Effect to check login status and redirect if not logged in
    useEffect(() => {
        console.log("Checking for login status");
        if (!isAuthenticated()) {
            // Redirect to the login page if not authenticated
            console.log("User not authenticated, redirecting to login page...");
            navigate('/login');
        } else {

            console.log("user is:", Cookies.get('username'))
            console.log("User authenticated, proceeding...");
        }
    }, [navigate]);

    // Main component content for authenticated users
    return (
        <div className="flex pt-16 flex-col text-center justify-center">
            <div className="px-2 pt-2 pb-3 space-y-5 flex-col text-center">
                <UserProfileCard />
                <TaskCard employee_id={Cookies.get('username')}/>
                <ShiftLog />
            </div>
        </div>
    );
};

