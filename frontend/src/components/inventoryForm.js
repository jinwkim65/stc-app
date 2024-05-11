import { React, useState, useEffect } from 'react';
import {
    Divider,
    Card,
    Button,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    SearchSelect,
    SearchSelectItem,
    NumberInput
} from '@tremor/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export default function InventoryForm({ location }) {
    // Declaring state variables
    const navigate = useNavigate();
    const [tonerTypes, setTonerTypes] = useState([]);
    const [tonerCounts, setTonerCounts] = useState({
        type: '',
        black: location.black_toner,
        cyan: location.cyan_toner,
        magenta: location.magenta_toner,
        yellow: location.yellow_toner,
        waste: location.waste_toner
    });
    const [paperCount, setPaperCount] = useState(location.paper);
    const [equipment, setEquipment] = useState({
        keyboards: location.keyboards,
        mice: location.mice,
    });
    // Function to handle toner count changes in the Toner form
    const handleTonerCountChange = (value, color) => {
        setTonerCounts({
            ...tonerCounts,
            [color]: value
        });
    };
    // Function to handle paper count changes in the Paper form
    const handlePaperCountChange = (value) => {
        setPaperCount(value);
    };
    // Function to handle equipment count changes in the Equipment form
    const handleEquipmentChange = (value, equipmentType) => {
        setEquipment({
            ...equipment,
            [equipmentType]: value
        });
    };
    const reportActivity = async (activity) => {
        // 2 = Toner change, 3 = Paper change, 4 = Equipment change
        axios.post("http://127.0.0.1:5000/log_activity", {
            body: {
                shift_id: Cookies.get('shift_id'),
                type: activity,
                time: new Date().toISOString(),
                loc_id: location.id
            }
        })
        .then((response) => {
            if (response.status === 200) {
                if (activity === 2) console.log('Toner change activity logged successfully');
                else if (activity === 3) console.log('Paper change activity logged successfully');
                else console.log('Equipment change activity logged successfully');
            }
        })
        .catch((error) => {
            console.error(`Error logging activity ${activity} ${error})`);
        });
    };
    // Function to handle form submission
    let endpoint = 'http://127.0.0.1:5000/';
    const handleSubmit = async (event) => {
        event.preventDefault();
        const msg = {
            loc_id: location.id,
            toner_counts: tonerCounts,
            paper_count: paperCount,
            equipment: equipment,
        };
        endpoint = endpoint + 'update_inventory';
        try {
            const response = await axios.post(endpoint, { body: msg });
            console.log('Success submitting inventory form:', response);
            try {
                await reportActivity(2);
                await reportActivity(3);
                await reportActivity(4);
            } catch (error) {
                console.error('Error reporting inventory form activity:', error);
            }
        } catch (error) {
            console.error('Error submitting inventory form:', error);
        }
        navigate('/inventory');
    };

    // Fetch toner types from the backend on page load
    useEffect(() => {
        const fetchTonerTypes = async () => {
            try {
                await axios.get('http://127.0.0.1:5000/get_toner_types')
                    .then(response => {
                        setTonerTypes(response.data);
                    });
            }
            catch (error) {
                console.error('Error fetching toner types:', error);
            }
        }
        fetchTonerTypes();
    }, []);

    return (
        <div className="pt-16 bg-black bg-opacity-50 relative h-full w-full flex justify-center items-center z-50">
            <div className="rounded-lg">
                <Card className="mx-auto max-w-xs">
                    <p className="text-2xl text-center text-tremor-content-strong dark:text-dark-tremor-content"> {location.loc + ' Cluster'}</p>
                    <div className="flex justify-center space-x-5 pt-5">
                        <div className="space-y-3">
                            <TabGroup>
                                <TabList className='flex justify-center'>
                                    <Tab>Toner</Tab>
                                    <Tab>Paper</Tab>
                                    <Tab>Equipment</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        {/* Toner Form */}
                                        <div className='space-y-3'>
                                            <div className='flex items-center whitespace-nowrap pb-2'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Toner Type</label>
                                                <SearchSelect onValueChange={(value) => { handleTonerCountChange(value, 'type') }} placeholder='Start typing ...'>
                                                    {tonerTypes.map((item) => (
                                                        <SearchSelectItem value={item.type}>{item.type}</SearchSelectItem>
                                                    ))}
                                                </SearchSelect>
                                            </div>
                                            <Divider>Toner Counts</Divider>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Black</label>
                                                <NumberInput min={0} max={20} step={1} value={tonerCounts['black']} onValueChange={(value) => handleTonerCountChange(value, 'black')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Cyan</label>
                                                <NumberInput min={0} max={20} step={1} value={tonerCounts['cyan']} onValueChange={(value) => handleTonerCountChange(value, 'cyan')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Magenta</label>
                                                <NumberInput min={0} max={20} step={1} value={tonerCounts['magenta']} onValueChange={(value) => handleTonerCountChange(value, 'magenta')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Yellow</label>
                                                <NumberInput min={0} max={20} step={1} value={tonerCounts['yellow']} onValueChange={(value) => handleTonerCountChange(value, 'yellow')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content pr-2'>Waste</label>
                                                <NumberInput min={0} max={20} step={1} value={tonerCounts['waste']} onValueChange={(value) => handleTonerCountChange(value, 'waste')} />
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        {/* Paper Form */}
                                        <div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content whitespace-nowrap pr-2'>Paper Count</label>
                                                <NumberInput min={0} max={20} step={.1} value={paperCount} onValueChange={(value) => handlePaperCountChange(value)} />
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        {/* Equipment Form */}
                                        <div>
                                            <div className='flex items-center pb-2'>
                                                <label className='dark:text-dark-tremor-content whitespace-nowrap pr-2'>Keyboards</label>
                                                <NumberInput min={0} max={20} step={1} value={equipment["keyboards"]} onValueChange={(value) => handleEquipmentChange(value, 'keyboards')} />
                                            </div>
                                            <div className='flex items-center'>
                                                <label className='dark:text-dark-tremor-content whitespace-nowrap pr-2'>Mice</label>
                                                <NumberInput min={0} max={20} step={1} value={equipment["mice"]} onValueChange={(value) => handleEquipmentChange(value, 'mice')} />
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>
                    </div>
                    <div className="flex justify-center pt-5">
                        <Button size='xs' variant="secondary" onClick={handleSubmit}>Submit</Button>
                        <div className="ml-2">
                            <Link to='/inventory'><Button size='xs' variant="secondary">Cancel</Button></Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
