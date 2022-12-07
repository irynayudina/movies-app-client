import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from "@fortawesome/free-solid-svg-icons";

const LogIn = () => {
    const [user, setUser] = useState('')
    const [pwInterval, setPwInterval] = useState('')
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

    const loginUser = (e)=>{
        e.preventDefault()
        if(emailValid && passwordValid){
            axios.post('https://movies-catalog-app.herokuapp.com/user/login', {
                "user-email-login": emailInp,
                "user-password-login": pwInp                
            })
            .then((res) => {
            let o = res.data
            setUser(o);
            })
            .catch((err) => {
            console.log(err)
            });
        }        
    }
    const resetPassword = ()=>{
        axios.post("https://movies-catalog-app.herokuapp.com/user/forgotpassword", {
            "user-email-login": emailInp
        })
        .then((res) => {
        let o = res.data
        setUser(o);
        })
        .catch((err) => {
        console.log(err)
        });
    }
    const [count, setCount] = useState(pwInterval) 
    useEffect(()=>{
        if(user && !user.error && user._id != undefined){
            localStorage.setItem('user', JSON.stringify(user))
            if(user.userIsNew){
                localStorage.setItem('user_new_tried_login', user.email)
                localStorage.removeItem('user');
                window.location.replace(`https://movies-app-playlists.netlify.app/user/passwordreset`);
            } else {
                window.location.replace(`https://movies-app-playlists.netlify.app/user/playlists`);
            }
        }
        if (user && user.pwWait) {
            setPwInterval(user.pwWait)
            setCount(user.pwWait)
        }
    }, [user])
    let timer   
    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setCount(prevCount => prevCount - 1000)
        }, 1000)
        
        if (count <= 0) clearInterval(timer)
    }    
    useEffect(() => {
        if (pwInterval) {
            updateCount()        
            return () => clearInterval(timer)
        }
    }, [count, pwInterval])
    const eye = <FontAwesomeIcon icon={faEye} />
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const [passwordShown, setPasswordShown] = useState(false);
    return (
        <>
        <Header />
        <div className="add-films"> 
            <h1>Log in</h1>
            <div className="hr"></div>
                <div className='err'>{user.error}</div>
                <div className='err'>{user.pwEmail}</div>
                <div className='err'>{pwInterval?'Timer: '+count:""}</div>
            <form onSubmit={loginUser}>
                <label htmlFor="user-email-login">Email Address</label>
                <input type="email" id="user-email-login" name="user-email-login" aria-describedby="emailLoginHelp" 
                placeholder="mypersonalmail123@gmail.com"
                onChange={eHandler}
                onBlur={eBlurHandler}
                value={emailInp} />
                {emailInpTouched && !emailValid && <div className='err'><small>Incorrect format of email (user123@mail.com)</small></div>}
                
                <label htmlFor="user-password-login">Password</label>
                <input type={passwordShown?"text":"password"} id="user-password-login" name="user-password-login" autoComplete="on"
                onChange={pHandler}
                onBlur={pwBlurHandler}
                value={pwInp} />
                <div className="clickable i" onClick={togglePasswordVisiblity}>{eye}</div>           
                {pwInpTouched && !passwordValid && <div className='err'><small>Password can`t be empty</small></div>}
                <button type="submit" >Submit</button>
            </form>
            <a href="https://movies-app-playlists.netlify.app/register">Register</a>
            <a href="#" onClick={resetPassword} style={{"float":"right"}}>Forgot password</a>
            </div>          
        <Footer />
        </>
    )
}
export default LogIn;
