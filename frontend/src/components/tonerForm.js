import { React, useState } from 'react';
import {
    Divider,
    Card,
    Button,
    NumberInput,
    TabPanel,
    SelectItem,
    Select,
    Tab,
    TabGroup,
    TabPanels,
    TabList
} from '@tremor/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


export default function TonerForm({ printer }) {
    // Declaring state variables
    const navigate = useNavigate();
    const [tonerCounts, setTonerCounts] = useState({
        black: printer.toner_percentage.black,
        cyan: printer.toner_percentage.cyan,
        magenta: printer.toner_percentage.magenta,
        yellow: printer.toner_percentage.yellow,
    });
    const [type, setType] = useState(0);

    // Function to handle toner count changes in the Toner form
    const handleTonerCountChange = (value, color) => {
        setTonerCounts({
            ...tonerCounts,
            [color]: value
        });
    };
    // Function to handle toner count changes in the Toner form
    const handleTypeChange = (value) => {
        setType(value);
    };
   
    // Function to handle form submission
    let endpoint = 'http://127.0.0.1:5000/';
    const handleSubmit = async (event) => {
        event.preventDefault();
        const msg = {
            printer_id: printer.id,
            status: type,
            k_level: tonerCounts.black,
            c_level: tonerCounts.cyan,
            m_level: tonerCounts.magenta,
            y_level: tonerCounts.yellow,
        };
        console.log(msg);
        endpoint = endpoint + 'percent';
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
                        <TabGroup>
                                <TabList className='flex justify-center'>
                                    <Tab>Toner</Tab>
                                    <Tab>Status</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        {/* Toner Form */}
                                        <div className='space-y-3'>   
                                            <Divider>Toner Counts</Divider>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Black</label>
                                                <NumberInput min={0} max={100} step={1} value={tonerCounts['black']} onValueChange={(value) => handleTonerCountChange(value, 'black')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Cyan</label>
                                                <NumberInput min={0} max={100} step={1} value={tonerCounts['cyan']} onValueChange={(value) => handleTonerCountChange(value, 'cyan')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Magenta</label>
                                                <NumberInput min={0} max={100} step={1} value={tonerCounts['magenta']} onValueChange={(value) => handleTonerCountChange(value, 'magenta')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Yellow</label>
                                                <NumberInput min={0} max={100} step={1} value={tonerCounts['yellow']} onValueChange={(value) => handleTonerCountChange(value, 'yellow')} />
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <Select defaultValue={0} onValueChange={handleTypeChange}>
                                            <SelectItem value={0}>Functional</SelectItem>
                                            <SelectItem value={1}>Not Working</SelectItem>
                                            <SelectItem value={2}>Reported Problems</SelectItem>
                                        </Select>
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>
                    </div>
                    <div className="flex justify-center pt-5">
                        <Button size='xs' variant="secondary" onClick={handleSubmit}>Submit</Button>
                        <div className="ml-2">
                            <Link to='/'><Button size='xs' variant="secondary">Cancel</Button></Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
