import { React, useState, useEffect } from 'react';
import { Card, List, ListItem } from '@tremor/react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ShiftLog() {
    // Declare variables
    const [shiftReport, setShiftReport] = useState([]);
    // Query the database for the shift report
    const getShiftReport = async () => {
        await axios.get('http://localhost:5000/shift_report',
            {
                params: {
                    user_id: Cookies.get('username')
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Shift report retrieved successfully');
                    setShiftReport(response.data);
                }
            })
            .catch((error) => {
                console.error('Error retrieving shift report:', error);
            });
    };

    // Dictionary to map activity code to activity type
    const activityMap = {
        0: 'Clocked in',
        1: 'Clocked out',
        2: 'Toner count update',
        3: 'Paper count update',
        4: 'Equipment tally update',
    };

    // Fetch the shift report on component mount
    useEffect(() => {
        getShiftReport();
    }, []);
    return (
        <Card className='mx-auto max-w-l max-h-30 overflow-y-auto' style={{ height: '200px' }}>
            <h1 className='text-2xl font-bold text-white text-center'>Shift Report</h1>
            <List>
                {shiftReport.map((shift) => (
                    <div className='flex flex-co'>
                        <ListItem key={shift.shift_id}>
                            {shift['activities'].map((activity) => (
                                <span key={activity.time}>
                                {activity.time}: {activityMap[activity.type]} 
                                {activity.location && activity.location.trim() !== "" ? ` at ${activity.location}` : ""}
                            </span>
                            ))}
                        </ListItem>
                    </div>
                ))}
            </List>
        </Card>
    );
}