import axios from 'axios'
import { useState } from 'react'



export default function Signupform()
{
    const [email,setemail] = useState('')
    const [pass,setpass] = useState('')
 async function axiosreq() {
    //change
    try{
            await axios.post('http://localhost:5000/signup',{email: email, password: pass})
               
                setpass('')
                setemail('')
     } catch(e) {
                console.log(e)
                alert(e)
            }
                
        
    }
   
    return(
       <form onSubmit={(e)=>{
        e.preventDefault()
        alert('submitted' + pass+ " " + email)
        axiosreq()
       }}>
            <label htmlFor='email'>Email</label>
            <input id='email' value={email} onChange={(e) => setemail(e.target.value)}></input>
            <label htmlFor='password'>Password</label>
            <input id='password' type='password' value={pass} onChange={(e) => setpass(e.target.value)}></input>
            <button>Submit</button>
        </form>
    )
}