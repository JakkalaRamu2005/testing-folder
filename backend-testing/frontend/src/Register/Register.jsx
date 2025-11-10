import React from 'react'
import "./register.css"
import { useState } from 'react'
import axios from "axios"


const Register = () => {

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: ""
    })




    return (
        <div className='container'>
            <div>
                <label htmlFor="username">Name:</label>
                <input value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} type="text" placeholder='Enter your name' id="username" />
            </div>
            <div>
                <label htmlFor="email">email:</label>
                <input value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} type="text" placeholder='Enter your email' id="email" />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input value={userDetails.password} onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} type="text" placeholder='Enter your password' id="password" />
            </div>
            <button>Register</button>

        </div>
    )
}

export default Register
