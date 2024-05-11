import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from '@tremor/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Function to handle CAS login
  const handleCasLogin = async () => {
    if (email.endsWith('@yale.edu')) {
      try {
        const response = await casLogin();
        console.log(response);
        if (response.login_url) {
          // Redirect the user to CAS login page
          window.location.href = response.login_url;
        } else {
          console.error("No login URL received in response.");
        }
      } catch (error) {
        console.error("Error during CAS login:", error);
      }
    } else {
      setEmailError("Please enter a valid Yale email!");
    }
  };

  // Function to initiate CAS login
  async function casLogin() {
    try {
      const response = await fetch("http://127.0.0.1:5000/cas/login");
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error during CAS login:", error);
    }
  }

  // Check for a CAS ticket in the URL when component mounts
  useEffect(() => {
    console.log("ticket validator called")
    const urlParams = new URLSearchParams(window.location.search);
    const ticket = urlParams.get('ticket');

    console.log("the ticket is:", ticket);
    if (ticket) {
      validateCasTicket(ticket);
    }
  }, []);

  // Validate CAS ticket

  async function validateCasTicket(ticket) {
    console.log("tryna validate cas ticket")

    try {
      const response = await fetch(`http://localhost:5000/cas/login?ticket=${ticket}`);
      //data represents the username
      const data = await response.json();
      console.log(data); // Assuming the response contains user data or error messages

      if (response.ok) {
        console.log("Been waveeyyyyyy!!!!")
        setUsername(data.username);
        setLoggedIn(true);
        // Set the token in a cookie
        Cookies.set('username', data.username, { expires: 7 })
        const yutes_name = Cookies.get('username'); // Retrieve the token from cookie
        console.log('Yutes id:', yutes_name);
        // Redirect the user to the home page
        navigate("/")
      } else {
        console.error("Error validating ticket:", data.error);
      }
    } catch (error) {
      console.error("Error validating ticket:", error);
    }
  }

  useEffect(() => {
    const lastInput = Cookies.get('lastEmail');
    if (lastInput) {
      setEmail(lastInput);
    }
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    const value = e.target.value;
    Cookies.set('lastEmail', value, { expires: 7 }); // Set cookie to expire in 7 days
  };

  return (
    <div className={'mainContainer'}>
      <div>
        <div className={'titleContainer'}>
          <div>Login</div>
        </div>
        <input
          value={email}
          placeholder="yale email"
          onChange={handleChange}
          className={'inputBox'}
        />
        {emailError && <label className="errorLabel">{emailError}</label>}


        <div className={'inputContainer'}>
          <Button variant="primary" onClick={handleCasLogin}> Login with CAS </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
