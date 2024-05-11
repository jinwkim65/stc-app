import { React, useEffect, useState } from 'react';
import { Dialog, DialogPanel, Button, Card } from '@tremor/react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ClockInButton() {
    const [open, setOpen] = useState(false);
    const [clockedIn, setClockedIn] = useState(false);

    const reportActivity = async (activity) => {
        // 0 = Clock-in, 1 = Clock-out
        axios.post("http://127.0.0.1:5000/log_activity", {
            body: {
                shift_id: Cookies.get('shift_id'),
                type: activity,
                time: new Date().toISOString(),
                loc_id: 99
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    if (activity === 0) console.log('Clock-in activity logged successfully');
                    else
                    console.log('Clock-out activity logged successfully');
                }
            })
            .catch((error) => {
                console.error('Error logging clock-in activity:', error);
            });
    };

    const handleClockIn = async () => {
        // Send time stamp to backend
        await axios.post('http://127.0.0.1:5000/clock_in', {
            body: {
                time: new Date().toISOString(),
                user_id: Cookies.get('username')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('Clocked in successfully');
                // Set shift_id cookie
                Cookies.set('shift_id', response.data.shift_id);
                // Close dialog
                setOpen(!open);
                // Update clockedIn state 
                Cookies.set('clockedIn', true);
                setClockedIn(true);
            }
        })
        .catch((error) => {
            console.error('Error clocking in:', error);
        });
        // Log clock-in activity
        reportActivity(0);
    };

    const handleClockOut = async () => {
        // Send time stamp to backend
        console.log('shift id:', Cookies.get('shift_id'))
        await axios.post('http://127.0.0.1:5000/clock_out', {
            body: {
                time: new Date().toISOString(),
                shift_id: Cookies.get('shift_id')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('Clocked out successfully');
                // Close dialog
                setOpen(!open);
                // Update clockedIn state 
                Cookies.set('clockedIn', false);
                setClockedIn(false);
            }
        })
        .catch((error) => {
            console.error('Error clocking out:', error);
        });
        // Log clock-out activity
        reportActivity(1);
    };
    
    useEffect(() => {
    }, [clockedIn]);

    return (
        <div>
            {clockedIn ?
                <>
                    {/* User is logged in */}
                    <Button variant='primary' onClick={() => setOpen(!open)}> Clock Out</Button>
                    <Dialog open={open} onClose={() => setOpen(!open)} title='Clock In'>
                        <DialogPanel>
                            <h3 className='text-center text-lgt font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Are you sure you want to clock out?</h3>
                            <div className='flex mt-2'>
                                <Button variant='secondary' onClick={() => setOpen(!open)} className='w-1/2 mr-2'>Cancel</Button>
                                <Button variant='primary' onClick={ () => { handleClockOut(); }} className='w-1/2'>Confirm</Button>
                            </div>
                        </DialogPanel>
                    </Dialog>
                </>
                :
                <>
                    {/* User is not logged in */}
                    <Button variant='secondary' onClick={() => setOpen(!open)}> Clock In</Button>
                    <Dialog open={open} onClose={() => setOpen(!open)} title='Clock In'>
                        <DialogPanel>
                            <h3 className='text-center text-lgt font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>Are you sure you want to clock in?</h3>
                            <div className='flex mt-2'>
                                <Button variant='secondary' onClick={() => setOpen(!open)} className='w-1/2 mr-2'>Cancel</Button>
                                <Button variant='primary' onClick={ () => { handleClockIn(); }} className='w-1/2'>Confirm</Button>
                            </div>
                        </DialogPanel>
                    </Dialog>
                </>
            }

        </div>
    );
}