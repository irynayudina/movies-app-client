import axios from 'axios';
import newContext from '../contexts/newContext';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Review from '../elements/Review';
import logoutFunc from '../utility/logoutFunc';
const Reviews = () =>{
    const messageFromContextProvidedbyParentFilm = useContext(newContext)
    const [user, setUser] = useState("")
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem('user')))
    }, [])

    const [textValid, setTextValid] = useState(false)

    const [textInp, setTextInp] = useState("")
    const [ratingInp, setRatingInp] = useState(8.9)

    const [textInpTouched, setTextInpTouched] = useState(false)

    const [review, setReview] = useState("")
    const [reviews, setReviews] = useState([])

    const textHandler = (e)=>{
    setTextInp(e.target.value)
    }
    const ratingHandler = (e) =>{
        setRatingInp(e.target.value)
    }
    const textBlurHandler = (e) => {
    setTextInpTouched(true);
    setTextValid((textInp !== "") || !textInpTouched);
    }
    const addReview = (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const urlfid = url.searchParams.get('id')
        if(!user?._id){
            alert("Log in before adding review")
        } else {
            if(textValid){
                axios
                  .post(
                    "https://movies-site-server.onrender.com/user/review",
                    {
                      fid: urlfid,
                      uid: user._id,
                      username: user.name,
                      text: textInp,
                      rating: ratingInp,
                    },
                    {
                      headers: {
                        authorization: "Bearer " + user.accessToken,
                      },
                    }
                  )
                  .then((res) => {
                    let o = res.data;
                    if (!o.error) {
                      setReview(updateTimeToTimezone(o));
                      setTextInp("");
                      setRatingInp(8.9);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err.response.status == 403) {
                      logoutFunc();
                    }
                  });
            }
        }        
    }
    useEffect(()=>{
        const url = new URL(window.location.href);
        const urlfid = url.searchParams.get('id')
        axios
          .get("https://movies-site-server.onrender.com/user/review", {
            params: {
              fid: urlfid,
            },
          })
          .then((res) => {
            let o = res.data;
            setReviews(o);
          })
          .catch((err) => {
            console.log(err);
          });
    }, [review])
  const updateTimeToTimezone = (review) => {
    const o = review;
    var offset = new Date().getTimezoneOffset();
    let upd = new Date(o.updatedAt);
    var offsetTime = new Date(upd.getTime() - offset * 60 * 1000);
    o.updatedAt = offsetTime.toISOString();
    return o;
    }
    return  (
        <>
        <div className="add-review"> 
        <h2>Add review</h2>
        <div className="hr"></div>
        <form onSubmit={addReview}>
            <label htmlFor="text">Text</label>
            <textarea onClick={()=>{if(!user?._id){
                alert("Log in before adding review")
            }}} name="text" className="form-control" id="text" cols="30" rows="10" 
            onChange={textHandler}
            onBlur={textBlurHandler}
            value={textInp} />
            {textInpTouched && !textValid && <div className='err'><small>Text can`t be empty</small></div>}            
            <label htmlFor="user-password-login">Rating</label>
            <input type="number" max="10" step="0.1" min="1" className="form-control" 
            id="rating" name="rating" aria-describedby="directorsHelp" placeholder="8.9"
            onChange={ratingHandler}
            value={ratingInp} />
            <button type="submit" >Submit</button>
        </form>
        </div>  
        {reviews.map((r) => (
            <React.Fragment  key={r._id}>
                <Review rev={r} user={user}/>
            </React.Fragment>))} 
        </>
    )
}
export default Reviews;