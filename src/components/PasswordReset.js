import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';
const PasswordReset = () =>{

  const [passwordnValid, setPasswordnValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  const [pInp, setPInp] = useState("")
  const [pnInp, setPnInp] = useState("")

  const [pInpTouched, setPInpTouched] = useState(false)
  const [pnInpTouched, setPnInpTouched] = useState(false)

  const pHandler = (e)=>{
    setPInp(e.target.value)
  }
  const pnHandler = (e)=>{
    setPnInp(e.target.value)
  }

  const pBlurHandler = (e) => {
    setPInpTouched(true);
    setPasswordValid((pnInp.trim() !== "") || !pnInpTouched);
  }
  const pnBlurHandler = (e) => {
    setPnInpTouched(true);
    setPasswordnValid((pnInp.trim() !== "") || !pnInpTouched);
  }

  
  const [user, setUser] = useState("")
  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('user')))
    console.log(localStorage.getItem('user'))
  }, [])
  const [success, setSuccess] = useState(false)
  const resetPassword = (e)=>{
    e.preventDefault()
    if(passwordValid && passwordnValid){
      axios.post('https://movies-catalog-app.herokuapp.com/user/pwreset', {
        em: user.email,
        opw: pInp, 
        npw: pnInp,
      })
      .then((res) => {
      let o = res.data
      console.log(o)
      if(!o.error){
        setSuccess(true)
      } else {
        setSuccess(false)
      }
      })
      .catch((err) => {
      console.log(err)
      });
    }        
  }
  return  (
    <>
    <Header />
    <div className="add-films"> 
    {success && <div className="err">Password changed successfully!</div>}
    <h1>Change password</h1>
    <div className="hr"></div>
    {/* <div className='err'>{user.error}</div> */}
    <form onSubmit={resetPassword}>
        <label htmlFor="user-email-login">Old password</label>
        <input type="password" id="opw" name="opw" autoComplete="on" 
        onChange={pHandler}
        onBlur={pBlurHandler}
        value={pInp} />
        {pInpTouched && !passwordValid && <div className='err'><small>Password  can`t be empty</small></div>}
        
        <label htmlFor="user-password-login">New password</label>
        <input type="password" id="npw" name="npw" autoComplete="on"
        onChange={pnHandler}
        onBlur={pnBlurHandler}
        value={pnInp} />
        {pnInpTouched && !passwordnValid && <div className='err'><small>Password can`t be empty</small></div>}
        <button type="submit" >Submit</button>
    </form>
    <a href="https://movies-app-playlists.netlify.app/">Cancel</a>
    </div>   
    <Footer />
    </>
  )
}
  export default PasswordReset;