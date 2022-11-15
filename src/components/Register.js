import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';

const Register = () =>{
    
    const [usernameValid, setUsernameValid] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [passwordSame, setPasswordSame] = useState(true)

    const [usernameInp, setUsernameInp] = useState("")
    const [usernameTaken, setUsernameTaken] = useState("")
    const [emailInp, setEmailInp] = useState("")
    const [pwInp, setPwInp] = useState("")
    const [pw2Inp, setPw2Inpp] = useState("")
    
    const [usernameInpTouched, setUsernameInpTouched] = useState(false)
    const [emailInpTouched, setEmailInpTouched] = useState(false)
    const [pwInpTouched, setPwInpTouched] = useState(false)
    const [pw2InpTouched, setPw2InppTouched] = useState(false)

    const uHandler = (e)=>{
        setUsernameInp(e.target.value)
    }
    const eHandler = (e)=>{
        setEmailInp(e.target.value)
    }
    const pHandler = (e)=>{
        setPwInp(e.target.value)
    }
    const p2Handler = (e)=>{
        setPw2Inpp(e.target.value)
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
    const pw2BlurHandler = (e) => {
        setPw2InppTouched(true);
        checkPasword();
    }

    const registerUser = (e)=>{
        e.preventDefault()
        setUsernameValid((usernameInp.trim() !== '') || !usernameInpTouched);        
        setEmailValid((/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(emailInp.trim())) || !emailInpTouched);
        setPasswordValid((pwInp == pw2Inp) || !pwInpTouched || !pw2InpTouched);
        if(usernameValid && emailValid && passwordValid && passwordSame){
            axios.post('https://movies-catalog-app.herokuapp.com/user/new', {
                'user-email': emailInp.trim(),
                'user-password': pwInp,
                'user-name': usernameInp.trim(),
            })
            .then(function (response) {
                if(response.data == 'User is already created'){
                    setUsernameTaken(response.data+". Try another email")
                } else {
                    localStorage.setItem('user', JSON.stringify(response.data))
                    window.location.replace(`https://movies-app-playlists.netlify.app/user/${response.data._id}/playlists`);
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
        // Відбраковування паролів, які містять групи однакових букв. 
        // Примусова зміна паролю під час першого входу в систему. 
        // Допустима довжина групи 2 букви. Обмеження на кількість таких груп – 1.         
        for (let i = 0; i < passwordTest.length-1; i++){
            if(passwordTest[i] == passwordTest[i+1]){
                ++sameCharsGroups;
            }
            if(sameCharsGroups > 1){
                setPasswordError("Should have not more than 1 group of 2 repeating characters")
                setPasswordValid(false);
            } else {
                setPasswordValid(true)
                setPasswordError("")
            }
        }
        console.log(passwordTest.length);
        console.log("same count "+sameCharsGroups);
    }
    const showPw = (e)=>{
        let x = e.target;
        if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
        
    }
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
                <input type="password" id="user-password" name="user-password"  placeholder="" autoComplete="on"
                onChange={pHandler}
                onBlur={pwBlurHandler}
                onClick={showPw}
                value={pwInp} />   
                {!passwordValid && pwInpTouched && <div className='err'><small>{passwordError}</small></div>}

                <label htmlFor="user-password2">Repeat Password</label>
                <input type="password" id="user-password2" name="user-password2" placeholder="" autoComplete="on" 
                onChange={p2Handler}
                onBlur={pw2BlurHandler}
                onClick={showPw}
                value={pw2Inp} />
                {!passwordSame && <div className='err'><small>Passwords don't match</small></div>}

                <button type="submit">Submit</button>
            </form>
        <a href="https://movies-app-playlists.netlify.app/user/login">Log in</a>
            </div>          
        <Footer />
    </>)
}
export default Register;