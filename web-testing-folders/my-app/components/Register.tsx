"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import "./login.css"
const Register = () => {

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setMsg("Please fill all fields");
            return;
        }

        setMsg("Loading...");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message || "Registration failed");
                return;
            }

            setMsg("Registered successfully");
            router.push("/login")
           
        } catch (error) {
            setMsg("Something went wrong");

        }

    }




    return (
        <div className='container'>
            <h2>Register</h2>



            <form onSubmit={handleRegister}>
                <div>
                    <label>Name:</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Enter your name' />
                </div>
                <div>
                    <label>Email:</label>
                    <input onChange={(e) => setMail(e.target.value)} value={email} type="text" placeholder='Enter your email' />
                </div>
                <div>
                    <label htmlFor="">password:</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" placeholder='Enter your password' />
                </div>


                <button type='submit'>Register</button>

            </form>


            <p className='err-msg'>{msg}</p>

        </div>
    )
}

export default Register
