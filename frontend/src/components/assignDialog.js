import { 
    Card,
    Button,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    TextInput, 
    ListItem} from '@tremor/react';
  import {React, useState} from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  
  
  export default function AssignDialog({ user, report, onClose }) {
    const navigate = useNavigate();
    let endpoint = 'http://127.0.0.1:5000/assign';

    const [desc, setDesc] = useState('');
    const [error, setError] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const timestamp = new Date(Date.now());
        const formattedTimestamp = timestamp.toISOString();
        const msg = {
            loc_id: report.loc_id,
            employee_id: user.id,
            type: report.type,
            desc: desc,
            time: formattedTimestamp,
            report_id: report.r_id
        };
        console.log(msg);
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
        navigate('/tasks');
    };
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-lg">
          <Card className="mx-auto max-w-xs">
            <div className="flex justify-center space-x-5 pt-5">
              <div className="space-y-3">
                <TabGroup>
                  <TabList className='flex justify-center'>
                    <Tab>{"Assign to ".concat(user.first)}</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div className='pb-2'>
                        <p className="text-tremor-content-strong dark:text-dark-tremor-content text-center">{report.loc_name}</p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <TextInput placeholder="Max 50 chars" onValueChange={handleDescChange} error={error}/>
                        <Button size='xs' variant="secondary" onClick={handleSubmit} disabled={error}>Submit</Button>
                        <Button size='xs' variant="secondary" onClick={onClose}>Close</Button>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  
  