import InventoryForm from "../inventoryForm";
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Update() {
    const location = useLocation(); 
    const { item } = location.state;
    return (
        <div>  
            <InventoryForm location={ item }/>
        </div>
    )
}