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
import AssignDialog from './assignDialog';

export default function ReportTable({ user }) {
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
    const fetchReports= async () => {
      try{
        await axios.get('http://127.0.0.1:5000/get_reports')
        .then(response => {
          setData(response.data);
        });
      }
      catch (error) {
        console.error('Error fetching report data:', error);
      }
    }
    fetchReports();
  }, []);

  return (
    <> 
      <Card className='pt-16'> {/* Padding to create room for fixed navbar */}
        <Table color='white'>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Cluster Name</TableHeaderCell>
              <TableHeaderCell>Printer Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Desc</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
                <TableRow key={index}>
                  {/* Make printer location clickable */}
                    <TableCell onClick={() => handleRowClick(item)} className="cursor-pointer hover:underline">{item.loc_name}</TableCell>
                  <TableCell>{item.p_name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell >{item.time}</TableCell>
                  <TableCell>{item.desc}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Show location dialog when a row is clicked */}
      {selectedItem && <AssignDialog user={user} report={selectedItem} onClose={handleCloseDialog} />}
    </>
  )
}
