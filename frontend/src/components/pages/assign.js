import React from 'react';
import { useLocation } from 'react-router-dom';
import ReportTable from "../reportTable";

export default function Assign() {
    const location = useLocation(); 
    const { item } = location.state;
    return (
        <>
            <div>
                <ReportTable user={item}/>
            </div>
        </>
    )
}
