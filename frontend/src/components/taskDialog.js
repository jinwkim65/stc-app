import { 
  Card,
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels } from '@tremor/react';
import { Link } from 'react-router-dom';
import React from 'react';
import TaskCard from './taskCard';


export default function TaskDialog({ item, onClose }) {
  // Dialog to report a problem or update inventory for a location
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-lg">
        <Card className="mx-auto max-w-xxl">
          <p className="text-2xl text-center text-tremor-content-strong dark:text-dark-tremor-content">{item.loc}</p>
          <p className="text-l text-center text-tremor-content-strong dark:text-dark-tremor-content">{item.addr}</p>
          <div className="flex justify-center space-x-5 pt-5">
            <div className="space-y-3">
              <TabGroup>
                <TabList className='flex justify-center'>
                  <Tab>Current Tasks</Tab>
                  <Tab>Add Tasks</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                  <div className="flex justify-center space-x-4">
                    <TaskCard employee_id={item.id} />
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button size='xs' variant="secondary" onClick={onClose}>Close</Button>
                  </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='pb-2'>
                      <p className="text-tremor-content-strong dark:text-dark-tremor-content text-center">Assign New Task</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      {/* Passing the 'item' object as a prop to the `/update/${id}` link for use in the InventoryForm */}
                      <Link to={`/assign`} state={{item:item}}><Button variant="secondary">Assign</Button></Link>
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


