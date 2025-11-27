import React from 'react'
import "./login.css"

const Login =()=> {
    return (
        <div className='container'>
            <form>
                <div>
                    <label htmlFor="">Name:</label>
                    <input type="text" placeholder='Enter the username' />

                </div>
                <div>
                    <label htmlFor="">Password:</label>
                    <input type="text" placeholder='Enter the password' />

                </div>
                <button type='submit'>Login</button>

            </form>
        </div>
    )
}



export default Login
