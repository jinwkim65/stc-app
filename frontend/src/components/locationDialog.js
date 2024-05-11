import { 
  Card,
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels } from '@tremor/react';
import { Link } from 'react-router-dom';
import {React, useState, useEffect} from 'react';
import axios from "axios";
import Cookies from "js-cookie";


export default function LocationDialog({ item, onClose }) {
  const [empStatus, setStatus] = useState(false);
  useEffect(() => {
    const isSTC = async () => {
        const msg = {
            id: Cookies.get('username')
        };
        try {
            await axios.post("http://127.0.0.1:5000/is_stc", msg, {
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .then(response => {
                const isSTCResult = response.data.isSTC[0][0];
                setStatus(isSTCResult);
                console.log('empStatus:', isSTCResult);
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
    } 
    isSTC();
}, []);
  // Dialog to report a problem or update inventory for a location
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-lg">
        <Card className="mx-auto max-w-xs">
          <p className="text-2xl text-center text-tremor-content-strong dark:text-dark-tremor-content">{item.loc + " Cluster"}</p>
          <p className="text-l text-center text-tremor-content-strong dark:text-dark-tremor-content">{item.addr}</p>
          <div className="flex justify-center space-x-5 pt-5">
          {empStatus === true ? (
            <div className="space-y-3">
              <TabGroup>
                <TabList className='flex justify-center'>
                  <Tab>Inventory</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className='pb-2'>
                      <p className="text-tremor-content-strong dark:text-dark-tremor-content text-center">Update the inventory for this location during kilroy</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      {/* Passing the 'item' object as a prop to the `/update/${id}` link for use in the InventoryForm */}
                      <Link to={`/update/${item.id}`} state={{item:item}}><Button variant="secondary">Update</Button></Link>
                      <Button size='xs' variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          ) :  <Button size='xs' variant="secondary" onClick={onClose}>Close</Button>}
          </div>
        </Card>
      </div>
    </div>
  );
}
