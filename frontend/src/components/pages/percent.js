import TonerForm from "../tonerForm";
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Update() {
    const location = useLocation(); 
    const { item } = location.state;
    return (
        <div>  
            <TonerForm printer={ item }/>
        </div>
    )
}