import axios from 'axios';
import { useEffect, useState } from 'react';
const Reviews = () =>{
    const [user, setUser] = useState("")
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem('user')))
        console.log(localStorage.getItem('user'))
    }, [])

    const [textValid, setTextValid] = useState(false)
    const [textValid2, setTextValid2] = useState(false)

    const [textInp, setTextInp] = useState("")
    const [textInp2, setTextInp2] = useState("")
    const [ratingInp, setRatingInp] = useState(8.9)
    const [ratingInp2, setRatingInp2] = useState(8.9)

    const [textInpTouched, setTextInpTouched] = useState(false)
    const [textInpTouched2, setTextInpTouched2] = useState(false)

    const [review, setReview] = useState("")
    const [review2, setReview2] = useState("")
    const [reviews, setReviews] = useState([])

    const textHandler = (e)=>{
    setTextInp(e.target.value)
    }
    const textHandler2 = (e)=>{
    setTextInp2(e.target.value)
    }
    const ratingHandler = (e) =>{
        setRatingInp(e.target.value)
    }
    const ratingHandler2 = (e) =>{
        setRatingInp2(e.target.value)
    }

    const textBlurHandler = (e) => {
    setTextInpTouched(true);
    setTextValid((textInp !== "") || !textInpTouched);
    }
    const textBlurHandler2 = (e) => {
    setTextInpTouched2(true);
    setTextValid2((textInp2 !== "") || !textInpTouched2);
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
                    console.log(o)
                    // window.location.replace(window.location)
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
    }, [review, review2])
    const removeComment = (cid) =>{
        axios.post('https://movies-catalog-app.herokuapp.com/user/review/del/full', {
            rwid: cid
        })
        .then((res) => {
        let o = res.data
        if(!o.error){
            setReview(o)
        }
        })
        .catch((err) => {
        console.log(err)
        });
    }
    const [answerForm, setAFVisible] = useState(false)
    const showEdditCommentForm = (ct, crat) => {
        setAFVisible((prevState) => !prevState)
        setRatingInp2(crat)
        setTextInp2(ct)
    }
    const editReview = (e, cid) => {
        e.preventDefault();
        if(textValid2){
            console.log("edit")
            console.log("text" + textInp2 + " rating " + ratingInp2 + " review ID " + cid)
            axios.post('https://movies-catalog-app.herokuapp.com/user/review/update', {
            text: textInp2,
            rating: ratingInp2,
            rwid: cid
            })
            .then((res) => {
            let o = res.data
            console.log("response after editing")
            console.log(res)
            if(!o.error){
                setReview2(o)
            }
            })
            .catch((err) => {
            console.log(err)
            });
        }
        setAFVisible(false);
    }
    return  (
        <>
        <div className="add-review"> 
        <h2>Add review</h2>
        <div className="hr"></div>
        <form onSubmit={addReview}>
            <label htmlFor="text">Text</label>
            <textarea name="text" className="form-control" id="text" cols="30" rows="10" 
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
        <div className='comment' key={r?._id}>
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>removeComment(r?._id)}>delete</div>: ""}
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>showEdditCommentForm(r.text, r.rating)}>edit</div>: ""}
            {answerForm ? <form onSubmit={(e)=>editReview(e, r._id)}>
            <label htmlFor="text">Text</label>
            <textarea name="textEdit" className="form-control" id="textEdit" cols="30" rows="10" 
            onChange={textHandler2}
            onBlur={textBlurHandler2}
            value={textInp2} />
            {textInpTouched2 && !textValid2 && <div className='err'><small>Text can`t be empty</small></div>}            
            <label htmlFor="user-password-login">Rating</label>
            <input type="number" max="10" step="0.1" min="1" className="form-control" 
            id="ratingEdit" name="ratingEdit" aria-describedby="directorsHelp" placeholder="8.9"
            onChange={ratingHandler2}
            value={ratingInp2} />
            <button type="submit" >Submit</button>
            </form> : ""}
            <div className='comment-username'><a href={r?.user == user?._id ? `https://movies-app-playlists.netlify.app/user/${r?.user}/playlists` : `https://movies-app-playlists.netlify.app/user/${r?.user}/playlists/public?uid=${r?.user}&uname=${r?.username}`}>
                {r?.username}
            </a></div>
            {!answerForm ? <>
            <p className='err'>{r.rating}</p>
            <p>{r.text}</p></> : ""}
            {r.isUpdated ? <small>Updated ({r.updatedAt?.slice(0,10)}, {new Date(r.updatedAt).getTime})</small> : ""}
            {r.isUpdated ? <p className='date-review'><small>{r.updatedAt?.slice(0,10)}</small></p> : 
            <p className='date-review'><small>{r.createdAt.slice(0,10)}</small></p>}
        </div>
      ))} 
        </>
    )
}
export default Reviews;