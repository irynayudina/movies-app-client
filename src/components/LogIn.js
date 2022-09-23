import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';
const LogIn = () =>{
    const [emailValid, setEmailValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)

    const [emailInp, setEmailInp] = useState("")
    const [pwInp, setPwInp] = useState("")

    const [emailInpTouched, setEmailInpTouched] = useState(false)
    const [pwInpTouched, setPwInpTouched] = useState(false)

    const eHandler = (e)=>{
        setEmailInp(e.target.value)
    }
    const pHandler = (e)=>{
        setPwInp(e.target.value)
    }

    const eBlurHandler = (e) => {
        setEmailInpTouched(true);
        setEmailValid((/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(emailInp.trim())) || !emailInpTouched);
    }
    const pwBlurHandler = (e) => {
        setPwInpTouched(true);
        setPasswordValid((pwInp.trim() !== "") || !pwInpTouched);
    }

    const [user, setUser] = useState('')
    const loginUser = (e)=>{
        e.preventDefault()
        if(emailValid && passwordValid){
            axios.get('https://movies-catalog-app.herokuapp.com/user/login', {
                params: {
                    "user-email-login": emailInp,
                    "user-password-login": pwInp
                }
            })
            .then((res) => {
            let o = res.data
            setUser(o);
            console.log(o)
            })
            .catch((err) => {
            console.log(err)
            });
        }        
    }
    useEffect(()=>{
        if(user && !user.error && user._id != undefined){
            console.log('logged in sucessfully')
            localStorage.setItem('user', JSON.stringify(user))
            window.location.replace(`https://movies-app-playlists.netlify.app/user/${user._id}/playlists`);
        }
    }, [user])
    return (
        <>
        <Header />
        <div className="add-films"> 
            <h1>Log in</h1>
            <div className="hr"></div>
            <div className='err'>{user.error}</div>
            <form onSubmit={loginUser}>
                <label htmlFor="user-email-login">Email Address</label>
                <input type="email" id="user-email-login" name="user-email-login" aria-describedby="emailLoginHelp" 
                placeholder="mypersonalmail123@gmail.com"
                onChange={eHandler}
                onBlur={eBlurHandler}
                value={emailInp} />
                {emailInpTouched && !emailValid && <div className='err'><small>Incorrect format of email (user123@mail.com)</small></div>}
                
                <label htmlFor="user-password-login">Password</label>
                <input type="password" id="user-password-login" name="user-password-login" autoComplete="on"
                onChange={pHandler}
                onBlur={pwBlurHandler}
                value={pwInp} />
                {pwInpTouched && !passwordValid && <div className='err'><small>Password can`t be empty</small></div>}
                <button type="submit" >Submit</button>
            </form>
            <a href="https://movies-app-playlists.netlify.app/register">Register</a>
            </div>          
        <Footer />
        </>
    )
}
export default LogIn;