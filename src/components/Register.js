import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Register = () =>{
    const [usernameValid, setUsernameValid] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState("")

    const [usernameInp, setUsernameInp] = useState("")
    const [emailInp, setEmailInp] = useState("")
    const [pwInp, setPwInp] = useState("")
    
    const [usernameInpTouched, setUsernameInpTouched] = useState(false)
    const [emailInpTouched, setEmailInpTouched] = useState(false)
    const [pwInpTouched, setPwInpTouched] = useState(false)

    const uHandler = (e)=>{
        setUsernameInp(e.target.value)
    }
    const eHandler = (e)=>{
        setEmailInp(e.target.value)
    }
    const pHandler = (e)=>{
        setPwInp(e.target.value)
    }

    const uBlurHandler = (e) => {
        setUsernameInpTouched(true);
        setUsernameValid((usernameInp.trim() !== '') || !usernameInpTouched);
    }
    const eBlurHandler = (e) => {
        setEmailInpTouched(true);
        setEmailValid((/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(emailInp.trim())) || !emailInpTouched);
    }    
    const pwBlurHandler = (e) => {
        setPwInpTouched(true);
        checkPasword();
    }

    const randPass = ()=>{
        let spchars = '!@#$%^&*()~'
        let randpass = Math.random().toString(36).slice(2) + 
                Math.random().toString(36)
                    .toUpperCase().slice(2);
        for(let j = 0; j < 3; j++){
            let sci = Math.random()*spchars.length
            let i = 1 + Math.random()*(randpass.length - 1)
            randpass = randpass.slice(0, i) + spchars.at(sci) + randpass.slice(i);
        }
        setPwInp(randpass)
    }

    const registerUser = (e)=>{
        e.preventDefault()
        setUsernameValid((usernameInp.trim() !== '') || !usernameInpTouched);
        setEmailValid((/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(emailInp.trim())) || !emailInpTouched);
        if(usernameValid && emailValid && passwordValid ){
            axios
              .post("https://movies-site-server.onrender.com/user/new", {
                "user-email": emailInp.trim(),
                "user-password": pwInp,
                "user-name": usernameInp.trim(),
                userIsNew: true,
              })
              .then(function (response) {
                if (response.data.error == "User is already created") {
                  setUsernameTaken(response.data.error + ". Try another email");
                } else {
                  alert("Success! Try to log in in");
                  setUsernameTaken("");
                }
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    }
    
    const [passwordError, setPasswordError] = useState("");
    const checkPasword = ()=>{
        let sameCharsGroups = 0;
        let passwordTest = pwInp;
        if( passwordTest.length < 8){
            setPasswordError("Should be at east 8 characters long")
            setPasswordValid(false);
        } else if(passwordTest.match(/[!@#$%^&*()~]/) == null){
            setPasswordError("Should have at least one special character !@#$%^&*()~")
            setPasswordValid(false);
        } else {     
            for (let i = 0; i < passwordTest.length-1; i++){
                if(passwordTest[i] == passwordTest[i+1]){
                    ++sameCharsGroups;
                }
                if(sameCharsGroups > 1){
                    setPasswordError("Should have not more than 1 group of 2 repeating characters")
                    setPasswordValid(false);
                } else {
                    setPasswordValid(true)
                }
            }
        }
    }
    const eye = <FontAwesomeIcon icon={faEye} />
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const [passwordShown, setPasswordShown] = useState(false);
    return (
    <>
    <Header />
        <div className="add-films"> 
            <h1>Register</h1>
            <div className="hr"></div>
            <div className='err'>{usernameTaken}</div>
            <form onSubmit={registerUser}>
                <label htmlFor="user-name">Name / Full name</label>
                <input type="text" id="user-name" name="user-name" 
                aria-describedby="nameHelp" placeholder="This will be displayed as your username" 
                onChange={uHandler}
                onBlur={uBlurHandler}
                value={usernameInp} />
                {usernameInpTouched &&  !usernameValid && <div className='err'><small>Username can`t be empty</small></div>}         
            
                <label htmlFor="user-email">Email Address</label>
                <input type="email" id="user-email" name="user-email" aria-describedby="emailHelp" placeholder="mypersonalmail123@gmail.com" 
                onChange={eHandler}
                onBlur={eBlurHandler}
                value={emailInp} />                
                {emailInpTouched && !emailValid && <div className='err'><small>Incorrect format of email (user123@mail.com)</small></div>}
            
                <label htmlFor="user-password">Password</label>
                <input type={passwordShown?"text":"password"} id="user-password" name="user-password"  placeholder="" autoComplete="on"
                onFocus={randPass}
                onChange={pHandler}
                onBlur={pwBlurHandler}
                value={pwInp} />   
                <div className="clickable i" onClick={togglePasswordVisiblity}>{eye}</div>           
                {!passwordValid && pwInpTouched && <div className='err'><small>{passwordError}</small></div>}
            
                <button type="submit">Submit</button>
            </form>
        <a href="https://movies-app-playlists.netlify.app/user/login">Log in</a>
            </div>          
        <Footer />
    </>)
}
export default Register;
