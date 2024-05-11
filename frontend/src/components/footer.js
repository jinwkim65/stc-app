import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-800 pt-10 pb-10 relative w-full bottom-0">
      <div className='footer-logo text-white pb-5'>
        <Link to='/' className='social-logo font-bold text-xl'>
          Student Technology Collaborative - Cluster Technology
        </Link>
      </div>
      <small className='text-white font-bold'>STC©2024</small>
    </div>
  );
}
