import { React, useState, useEffect } from 'react';
import { Card, Divider } from '@tremor/react';
import ClockInButton from './clockInButton';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function UserProfileCard() {
    const[userFirstName, setUserFirstName] = useState();
    const[userLastName, setUserLastName] = useState();
    const [lastestShift, setLatestShift] = useState();


    // Retrieve user's first and last name from the backend
    const getUserInfo = async () => {
        axios.get('http://127.0.0.1:5000/profile',{
            params: {
                user_id: Cookies.get('username')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setUserFirstName(response.data.first_name);
                setUserLastName(response.data.last_name);
            }
        })
        .catch((error) => {
            console.error('Error getting user info:', error);
        });
    };

    // Query shift tasks
    const getShiftTasks = async () => {
        await axios.get('http://localhost:5000/tasks',
            {
                params: {
                    employee_id: Cookies.get('username')
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Latest shift task retrieved successfully');
                    setLatestShift(response.data[0]['loc']);
                }
            })
            .catch((error) => {
                console.error('Error retrieving shift tasks:', error);
            });
    };

    useEffect(() => {
        getUserInfo();
        getShiftTasks();
    }, []);

    return (
        <>
            <Card className='mx-auto max-w-xs max-h-64 flex justify-center'>
                <div>
                    <h1 className='text-2xl font-bold text-white text-center'>{`${userFirstName} ${userLastName}`}</h1>
                    <div className='pt-4'>
                        <p className='text-white text-center '>{lastestShift}</p>
                    </div>
                    <Divider>Clock In</Divider>
                    <div className='pt-4 flex justify-center'>
                        <ClockInButton />
                    </div>
                </div>
            </Card>
        </>
    )
}
