import {PrinterMap} from "../printerMap"
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import UserTable from "../usersTable";


export default function Map() {
    const navigate = useNavigate();


     function isAuthenticated() {
        return !!Cookies.get('username');
    }

    // Effect to check login status and redirect if not logged in
    useEffect(() => {
        console.log("Checking for login status");
        if (!isAuthenticated()) {


            // Redirect to the login page if not authenticated
            console.log("User not authenticated, redirecting to login page...");
            navigate('/login');
        } else {

            console.log("user is:", Cookies.get('username'))

            console.log("User authenticated, proceeding...");
        }
    }, [navigate]);


    return (
      <div className="mainContainer">
        <PrinterMap />
      </div>
    );
  }