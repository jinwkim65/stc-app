import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  ProgressBar
} from '@tremor/react';
import { RiFlag2Line } from '@remixicon/react';
import { Card, Badge } from '@tremor/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrinterDialog from './printerDialog';

export default function PrinterTable({currentZone}) {
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

const filterData = data.filter((item) => {
  return currentZone === 'all' || currentZone === String(item.zone);
});
// Get color for toner progress bars based on toner percentage
const getColorByPercent = (p) => {
  if (p > 30) return "teal";
  else if (p > 10) return "yellow";
  else return "red";
}

// Fetch printer data from the backend
useEffect(() => {
  const fetchPrinters = async () => {
    try{
      await axios.get('http://127.0.0.1:5000/p_table')
      .then(response => {
        setData(response.data);
      });
    }
    catch (error) {
      console.error('Error fetching printer table data:', error);
    }
  }
  fetchPrinters();
}, []);

return (
  <> 
    <Card className='pt-16'> {/* Padding to create room for fixed navbar */}
      <Table color='white'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Functional</TableHeaderCell>
            <TableHeaderCell>Zone</TableHeaderCell>
            <TableHeaderCell>Toner Percentages</TableHeaderCell>
            <TableHeaderCell>Model</TableHeaderCell>
            <TableHeaderCell>Kyocera Serial</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((item, index) => (
            <TableRow key={index}>
              {/* Make printer location clickable */}
                <TableCell onClick={() => handleRowClick(item)} className="cursor-pointer hover:underline">{item.loc}</TableCell>
              <TableCell>
                <Badge color={item.status === 0 ? "emerald" : item.status === 1 ? "red" : "yellow"} icon={RiFlag2Line}>
                  {item.status === 0 ? "Functional" : item.status === 1 ? "Not Working" : "Reported Problems"}
                </Badge>
              </TableCell>
              <TableCell>{"Zone ".concat(item.zone)}</TableCell>
              <TableCell>
                <div className="flex">
                    <div className="mx-auto max-w-sm pr-2">
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                        <span>Black</span>
                      </p>
                      <ProgressBar value={item.toner_percentage.black} color={getColorByPercent(item.toner_percentage.black)} className="mt-3" />
                    </div>
                    <div className="mx-auto max-w-sm pr-2">
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                        <span>Cyan</span>
                      </p>
                      <ProgressBar value={item.toner_percentage.cyan} color={getColorByPercent(item.toner_percentage.cyan)} className="mt-3" />
                    </div>
                    <div className="mx-auto max-w-sm pr-2">
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                        <span>Magenta</span>
                      </p>
                      <ProgressBar value={item.toner_percentage.magenta} color={getColorByPercent(item.toner_percentage.magenta)} className="mt-3" />
                    </div>
                    <div className="mx-auto max-w-sm pr-2">
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                        <span>Yellow</span>
                      </p>
                      <ProgressBar value={item.toner_percentage.yellow} color={getColorByPercent(item.toner_percentage.yellow)} className="mt-3" />
                    </div>
                </div>
              </TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.kyocera_serial}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
    {/* Show location dialog when a row is clicked */}
    {selectedItem && <PrinterDialog item={selectedItem} onClose={handleCloseDialog} />}
  </>
)
}