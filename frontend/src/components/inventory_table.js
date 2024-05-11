import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react';
import { Card, Badge } from '@tremor/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationDialog from './locationDialog';

export default function InventoryTable({ currentZone }) {
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
// Filter data based on the current zone
const filterData = data.filter((item) => {
  return currentZone === 'all' || currentZone === String(item.zone);
});
// Fetch inventory data from the backend
useEffect(() => {
  const fetchInventory = async () => {
    try{
      await axios.get('http://127.0.0.1:5000/')
      .then(response => {
        setData(response.data);
      });
    }
    catch (error) {
      console.error('Error fetching inventory table data:', error);
    }
  }
  fetchInventory();
}, [currentZone]);

return (
  <> 
    <Card className='pt-16'> {/* Padding to create room for fixed navbar */}
      <Table color='white'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell>Paper</TableHeaderCell>
            <TableHeaderCell>Zone</TableHeaderCell>
            <TableHeaderCell>Toner Type</TableHeaderCell>
            <TableHeaderCell>Black</TableHeaderCell>
            <TableHeaderCell>Cyan</TableHeaderCell>
            <TableHeaderCell>Magenta</TableHeaderCell>
            <TableHeaderCell>Yellow</TableHeaderCell>
            <TableHeaderCell>Waste</TableHeaderCell>
            <TableHeaderCell>Keyboards</TableHeaderCell>
            <TableHeaderCell>Mice</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((item, index) => (
              <TableRow key={index}>
                {/* Make printer location clickable */}
                  <TableCell onClick={() => handleRowClick(item)} className="cursor-pointer hover:underline">{item.loc}</TableCell>
                <TableCell>{item.paper}</TableCell>
                <TableCell>{"Zone ".concat(item.zone)}</TableCell>
                <TableCell >{item.toner_type}</TableCell>
                <TableCell>{item.black_toner}</TableCell>
                <TableCell>{item.cyan_toner}</TableCell>
                <TableCell>{item.magenta_toner}</TableCell>
                <TableCell>{item.yellow_toner}</TableCell>
                <TableCell>{item.waste_toner}</TableCell> 
                <TableCell>{item.keyboards}</TableCell>
                <TableCell>{item.mice}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
    {/* Show location dialog when a row is clicked */}
    {selectedItem && <LocationDialog item={selectedItem} onClose={handleCloseDialog} />}
  </>
)
}