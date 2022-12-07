import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from "@fortawesome/free-solid-svg-icons";
import logoutFunc from '../utility/logoutFunc';
const ChangePasswordLab = () =>{
    const [pwInterval, setPwInterval] = useState('')
    
    const [passwordValid, setPasswordValid] = useState(false)
    const [passwordSame, setPasswordSame] = useState(true)

    const [pwInp, setPwInp] = useState("")
    const [pw2Inp, setPw2Inpp] = useState("")
    const [pwOld, setPwOld] = useState("")
    
    const [pwInpTouched, setPwInpTouched] = useState(false)

    const pHandler = (e)=>{
        setPwInp(e.target.value)
    }
    const p2Handler = (e)=>{
        setPw2Inpp(e.target.value)
    }
    const pwOldHandler = (e) =>{
        setPwOld(e.target.value)
    }
  
    const pwBlurHandler = (e) => {
        setPwInpTouched(true);
        checkPasword();
        setPasswordSame((pwInp == pw2Inp) )
    }
    const pw2BlurHandler = (e) => {
        setPasswordSame((pwInp == pw2Inp))
    }

    const [count, setCount] = useState(0) 
    const [user, setUser] = useState("")
    const [first, setFirst] = useState(false)
    useEffect(()=>{
        if (localStorage.getItem('user_new_tried_login') === null){
            setUser(JSON.parse(localStorage.getItem('user')))
        } else {
            setUser({email: localStorage.getItem('user_new_tried_login')})
            localStorage.removeItem('user_new_tried_login')
            setFirst(true)
        }
        if (user && user.pwWait) {
            setPwInterval(user.pwWait)
            setCount(user.pwWait)
        }
    }, [])
    let timer   
    const updateCount = () => {
        timer = !timer && setInterval(() => {
            if (count > 1000) {
                setCount(prevCount => prevCount - 1000)   
            } else {
                setCount(0)
            }
        }, 1000)
        
        if (count <= 0) clearInterval(timer)
    }    
    useEffect(() => {
        if (pwInterval) {
            updateCount()        
            return () => clearInterval(timer)
        }
    }, [count, pwInterval])
    const changePW = (e)=>{
        e.preventDefault()
        if(passwordValid && passwordSame){
            axios.post('https://movies-catalog-app.herokuapp.com/user/pwreset', {
            em: user.email,
            opw: pwOld, 
            npw: pwInp,
            }, {            
                headers: {
                    authorization: "Bearer " + user.accessToken
                } 
            }).then((res) => {
                let o = res.data
                setUser(o)
                setPwInterval(o.pwWait)
                setCount(o.pwWait)
            if(!o.error){
                alert("password changed successfully")  
                localStorage.setItem('user', JSON.stringify(o))              
                setTimeout(()=>{  
                    if(first) window.location.replace(`http://localhost:3000/user/playlists`);
                }, 2000)
            }
            })
            .catch((err) => {
                console.log(err)
                if (err.response.status == 403) {
                    logoutFunc()
                }
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
        } else if(passwordTest.match(/[a-zA-Z]/) == null){
            setPasswordError("Should have letters of english alphabet")
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
    const togglePasswordVisiblity1 = () => {
        setPasswordShown1(passwordShown1 ? false : true);
    };
    const [passwordShown1, setPasswordShown1] = useState(false);
    const togglePasswordVisiblity2 = () => {
        setPasswordShown2(passwordShown2 ? false : true);
    };
    const [passwordShown2, setPasswordShown2] = useState(false);
    return (
    <>
    <Header />
        <div className="add-films"> 
            <h1>{first ? "It is your first log in! Change password":"Change password"}</h1>
            <div className="hr"></div>
                <div className='err'>{count>0?user.error:""}</div>
                <div className='err'>{pwInterval?'Timer: '+count:""}</div>
            <form onSubmit={changePW}>

                <label>Old password</label>
                <input type={passwordShown2?"text":"password"} onChange={pwOldHandler}/>
                <div className="clickable i" onClick={togglePasswordVisiblity2}>{eye}</div>  
                
                <label htmlFor="user-password">Password</label>
                <input type={passwordShown1?"text":"password"} id="user-password" name="user-password"  placeholder="" autoComplete="on"
                onChange={pHandler}
                onBlur={pwBlurHandler}
                value={pwInp} />
                <div className="clickable i" onClick={togglePasswordVisiblity1}>{eye}</div>           
                {!passwordValid && pwInpTouched && <div className='err'><small>{passwordError}</small></div>}
            
                <label htmlFor="user-password2">Repeat Password</label>
                <input type={passwordShown1?"text":"password"} id="user-password2" name="user-password2" placeholder="" autoComplete="on" 
                onChange={p2Handler}
                onBlur={pw2BlurHandler}
                value={pw2Inp} />         
                {!passwordSame && <div className='err'><small>Passwords don't match</small></div>}
                    
                <button type="submit">Submit</button>
            </form>
            </div>          
        <Footer />
    </>)
}
export default ChangePasswordLab;