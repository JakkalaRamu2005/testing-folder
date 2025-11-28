"use client"
import "./login.css"
import { useState } from 'react'
import { useRouter } from "next/navigation"

const Login = () => {

    const router = useRouter();

    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setMsg("Please fill all fields");
            return;
        }

        setMsg("Loading ....")



        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email, password,
                }),
            });


            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message || "login failed");
                return;
            }

            setMsg("Login successful");
            router.push("/")


        } catch (error) {
            setMsg("Something went wrong");
        };
    }




    return (
        <div className='container'>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="">Email:</label>
                    <input onChange={(e) => setMail(e.target.value)} value={email} type="text" placeholder='Enter the mail' />

                </div>
                <div>
                    <label htmlFor="">Password:</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter the password' />

                </div>
                <button type='submit'>Login</button>

            </form>
            <p className="err-msg">{msg}</p>
        </div>
    )
}



export default Login
