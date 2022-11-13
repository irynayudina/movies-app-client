import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
const Review = (props) =>{
    const user = props.user
    const [editForm, setEditFormVisible] = useState(false)
    const [reviewEdited, setReviewEdited] = useState(props.rev)
    const r = reviewEdited;
    const [reviewRemoved, setReviewRemoved] = useState("")
    const [textInpEdited, settextInpEdited] = useState("")
    const [ratingInpEdited, setratingInpEdited] = useState(8.9)
    const [textInpTouchedEdited, settextInpTouchedEdited] = useState(false)
    const [textValidEdited, settextValidEdited] = useState(false)
    const removeComment = (cid) =>{
        axios.post('https://movies-catalog-app.herokuapp.com/user/review/del/full', {
            rwid: cid
        })
        .then((res) => {
        let o = res.data
        if(!o.error){
            setReviewRemoved(o)
        }
        })
        .catch((err) => {
        console.log(err)
        });
    }
    const textHandlerEdited = (e)=>{
        settextInpEdited(e.target.value)
    }
    const ratingHandlerEdited = (e) =>{
        setratingInpEdited(e.target.value)
    }
    const textBlurHandlerEdited = (e) => {
        settextInpTouchedEdited(true);
        settextValidEdited((textInpEdited !== "") || !textInpTouchedEdited);
    }
    const showEdditCommentForm = (ct, crat) => {
        setEditFormVisible((prevState) => !prevState)
        setratingInpEdited(crat)
        settextInpEdited(ct)
    }
    useEffect(()=>{
        var offset = new Date().getTimezoneOffset();
        let upd = new Date(r.updatedAt)
        var offsetTime = new Date(upd.getTime() + offset / (-60) * 60 * 60 * 1000);
        r.updatedAt = offsetTime.toISOString()
    },[])
    const editReview = (e, cid) => {
        e.preventDefault();
        if(textValidEdited){
            console.log("edit")
            console.log("text" + textInpEdited + " rating " + ratingInpEdited + " review ID " + cid)
            axios.post('https://movies-catalog-app.herokuapp.com/user/review/update', {
            text: textInpEdited,
            rating: ratingInpEdited,
            rwid: cid
            })
            .then((res) => {
            let o = res.data
            console.log("response after editing")
            console.log(res)
            if(!o.error){
                // var offset = new Date().getTimezoneOffset();
                // let upd = new Date(r.updatedAt)
                // var offsetTime = new Date(upd.getTime() + offset / (-60) * 60 * 60 * 1000);
                // o.updatedAt = offsetTime.toISOString()
                setReviewEdited(o)                
            }
            })
            .catch((err) => {
            console.log(err)
            });
        }
        setEditFormVisible(false);
    }
    return(
        <>
        {!reviewRemoved && <div className='comment'>
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>removeComment(r?._id)}>delete</div>: ""}
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>showEdditCommentForm(r.text, r.rating)}>edit</div>: ""}
            <div className='delete-comment' onClick={()=>{
                if(!user?._id){
                    alert("Log in before adding review")
                }
            }}>answer</div>
            {editForm ? <form onSubmit={(e)=>editReview(e, r._id)}>
                <label htmlFor="text">Text</label>
                <textarea name="textEdit" className="form-control" id="textEdit" cols="30" rows="10" 
                onChange={textHandlerEdited}
                onBlur={textBlurHandlerEdited}
                value={textInpEdited} />
                {textInpTouchedEdited && !textValidEdited && <div className='err'><small>Text can`t be empty</small></div>}            
                <label htmlFor="user-password-login">Rating </label>
                <input type="number" max="10" step="0.1" min="1" className="form-control" 
                id="ratingEdit" name="ratingEdit" aria-describedby="directorsHelp" placeholder="8.9"
                onChange={ratingHandlerEdited}
                value={ratingInpEdited} /> 
                <button type="submit" className='submit-edited-review'>Submit</button> <label className='clickable-text' onClick={()=>{setEditFormVisible(false)}}><small>Cancel</small></label>
                </form> : ""
            }
            <div className='comment-username'><a href={r?.user == user?._id ? `http://localhost:3000/user/${r?.user}/playlists` : `http://localhost:3000/user/${r?.user}/playlists/public?uid=${r?.user}&uname=${r?.username}`}>
                {r?.username}
            </a></div>
            {!editForm ? <>
            <p className='err'>{r.rating}</p>
            <p>{r.text}</p></> : ""}
            {r.isUpdated ? <small className='reviewUpdated'>Updated {r.updatedAt?.slice(0,10)}, {r.updatedAt?.slice(11, 16)}</small> : ""}
            <p className='date-review'><small>{r.createdAt?.slice(0,10)}</small></p>    
        </div>}        
        </>
    )
}
export default Review;