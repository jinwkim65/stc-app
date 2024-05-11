import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    ProgressBar
} from '@tremor/react';
import { Card, Badge } from '@tremor/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationDialog from './locationDialog';
import TaskDialog from './taskDialog';

export default function UserTable({ currentZone }) {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  // Open location dialog when a row is clicked
  const handleRowClick = (item) => {
    setSelectedItem(item);
  };
  // Close location dialog
  const handleCloseDialog = () => {
    setSelectedItem(null);
  };
  // Fetch user data from the backend
  useEffect(() => {
    const fetchUsers= async () => {
      try{
        await axios.get('http://127.0.0.1:5000/users')
        .then(response => {
          setData(response.data);
        });
      }
      catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <> 
      <Card className='pt-16'> {/* Padding to create room for fixed navbar */}
        <Table color='white'>
          <TableHead>
            <TableRow>
              <TableHeaderCell>netid</TableHeaderCell>
              <TableHeaderCell>First</TableHeaderCell>
              <TableHeaderCell>Last</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Incomplete Tasks</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
                <TableRow key={index}>
                  {/* Make printer location clickable */}
                    <TableCell onClick={() => handleRowClick(item)} className="cursor-pointer hover:underline">{item.id}</TableCell>
                  <TableCell>{item.first}</TableCell>
                  <TableCell>{item.last}</TableCell>
                  <TableCell >{item.role}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.tasks}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Show location dialog when a row is clicked */}
      {selectedItem && <TaskDialog item={selectedItem} onClose={handleCloseDialog} />}
    </>
  )
}
