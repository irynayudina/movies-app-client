import axios from 'axios';
import newContext from '../contexts/newContext';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Review from '../elements/Review';
const Reviews = () =>{
    const messageFromContextProvidedbyParentFilm = useContext(newContext)
    const [user, setUser] = useState("")
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem('user')))
        console.log(localStorage.getItem('user'))
        console.log("messageFromContextProvidedbyParentFilm logged in child reviews " + messageFromContextProvidedbyParentFilm)
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
                axios.post('https://movies-catalog-app.herokuapp.com/user/review', {
                    fid: urlfid,
                    uid: user._id,
                    username: user.name,
                    text: textInp, 
                    rating: ratingInp,
                })
                .then((res) => {
                let o = res.data
                if(!o.error){
                    setReview(o)
                    setTextInp("")
                    setRatingInp(8.9)
                }
                })
                .catch((err) => {
                console.log(err)
                });
            }
        }        
    }
    useEffect(()=>{
        const url = new URL(window.location.href);
        const urlfid = url.searchParams.get('id')
        axios.get('https://movies-catalog-app.herokuapp.com/user/review', {
            params: {
                "fid": urlfid
            }
        })
        .then((res) => {
        let o = res.data
        setReviews(o)
        console.log(reviews)
        })
        .catch((err) => {
        console.log(err)
        });
    }, [review])
    const updateTimeToTimezone = (r)=>{
        var offset = new Date().getTimezoneOffset();
        let upd = new Date(r.updatedAt)
        var offsetTime = new Date(upd.getTime() + offset / (-60) * 60 * 60 * 1000);
        r.updatedAt = offsetTime.toISOString()
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