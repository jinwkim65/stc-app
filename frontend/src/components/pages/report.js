import ReportForm from "../reportForm";
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Report() {
    const location = useLocation(); 
    const { item } = location.state;
    return (
        <>
            <div>
                <ReportForm printer={ item }/>
            </div>
        </>
    )
}
