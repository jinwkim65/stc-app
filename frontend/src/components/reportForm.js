import { React, useState } from 'react';
import {
    Card,
    Button,
    Select,
    SelectItem,
    TextInput
} from '@tremor/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


export default function ReportForm({ printer }) {
    // Declaring state variables
    const navigate = useNavigate();
    const [type, setType] = useState(0);
    const [desc, setDesc] = useState('');
    const [error, setError] = useState(false);

    // Function to handle type change in form
    const handleTypeChange = (value) => {
        setType(value);
    };
    // Function to handle desc change in form
    const handleDescChange = (str) => {
        setDesc(str)
        if (desc.length >= 50){
            setError(true);
        }
        else{
            setError(false);
        }
    };
    
    // Function to handle form submission
    let endpoint = 'http://127.0.0.1:5000/';
    const handleSubmit = async (event) => {
        event.preventDefault();
        const timestamp = new Date(Date.now());
        const formattedTimestamp = timestamp.toISOString();
        const msg = {
            printer_id: printer.id,
            time: formattedTimestamp,
            type: type,
            desc: desc,
        };
        console.log(msg);
        endpoint = endpoint + 'report';
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
        navigate('/');
    };

    return (
        <div className="pt-16 bg-black bg-opacity-50 relative h-full w-full flex justify-center items-center z-50">
            <div className="rounded-lg">
                <Card className="mx-auto max-w-xs">
                    <p className="text-2xl text-center text-tremor-content-strong dark:text-dark-tremor-content"> {printer.name}</p>
                    <div className="flex justify-center space-x-5 pt-5">
                        <div className="space-y-3">
                            <label>Type</label>
                            <Select defaultValue="1" onValueChange={handleTypeChange}>
                                <SelectItem value="1">Printer Offline</SelectItem>
                                <SelectItem value="2">Low Toner</SelectItem>
                                <SelectItem value="3">Low Paper</SelectItem>
                                <SelectItem value="4">Other</SelectItem>
                            </Select>
                            <label>Description</label>
                            <TextInput placeholder="Max 50 chars" onValueChange={handleDescChange} error={error}/>
                        </div>
                    </div>
                    <div className="flex justify-center pt-5">
                        <Button disabled={error} size='xs' variant="secondary" onClick={handleSubmit}>Submit</Button>
                        <div className="ml-2">
                            <Link to='/'><Button size='xs' variant="secondary">Cancel</Button></Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
