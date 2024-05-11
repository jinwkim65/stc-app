import {React, useState, useEffect} from 'react';
import {Card, List, ListItem, Button} from '@tremor/react';
import axios from 'axios';

export default function TaskCard({employee_id}){
    const [taskList, setTaskList] = useState([]);
    const typeMap = {
        0: "Printer Offline",
        1: "Low Toner",
        2: "Low Paper",
        3: "Other"
    }
    const getTaskList = async () => {
        await axios.get('http://localhost:5000/tasks',
        {
            params: {
                employee_id: employee_id
            }
        })
        .then((response) => {
            if (response.status === 200){
                console.log('Task card retrieved successfully')
                console.log(response.data)
                setTaskList(response.data)
            }
        })
        .catch((error) => {
            console.error('Error retrieving task card:', error)
        });
    };

    useEffect(() => {
        getTaskList();
    }, []);

    const handleClick = async (task) => {
        console.log("completed task:", task);
        const timestamp = new Date(Date.now());
        const formattedTimestamp = timestamp.toISOString();
        const msg = {
            task_id: task.id,
            time: formattedTimestamp,
        };
        console.log(msg);
        const endpoint = 'http://127.0.0.1:5000/complete';
        try {
            await axios.post(endpoint, {
                body: msg
            })
                .then(response => {
                    console.log('Success:', response);
                });
        }
        catch (error) {
            console.error('Error:', error);
        }

    };
    

    return (
        <Card className='mx-auto max-w-l max-h-30 overflow-y-auto' style={{height: '200px'}}>
            <h1 className='text-2xl font-bold text-white text-center mb-4'>Task Card</h1>
            <List>
                {taskList.map((task) => (
                    <ListItem key={task.id} className='grid grid-cols-5 gap-4 items-center'>
                        <span>{task.loc}</span>
                        <span>{typeMap[task.type]}</span>
                        <span>{task.desc}</span>
                        <span>{task.assigned}</span>
                        <span><Button onClick={() => handleClick(task)}>Mark as Completed</Button></span>
                    </ListItem>
                ))}
            </List>
        </Card>
      );
}