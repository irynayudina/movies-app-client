import axios from 'axios';
import { useState } from 'react';
import ReviewForm from './ReviewForm';
import logoutFunc from '../utility/logoutFunc';
const Review = (props) =>{
    const user = props.user
    const [editForm, setEditFormVisible] = useState(false)
    const [answerForm, setAnswerFormVisible] =useState(false)
    const [reviewEdited, setReviewEdited] = useState(props.rev)
    const r = reviewEdited;
    const [reviewRemoved, setReviewRemoved] = useState("")
    const removeComment = (cid) =>{
        axios
          .post(
            "https://moviesappserver-production.up.railway.app/user/review/del/full",
            {
              rwid: cid,
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
              setReviewRemoved(o);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status == 403) {
              logoutFunc();
            }
          });
    }
    const showEdditCommentForm = (ct, crat) => {
        setEditFormVisible((prevState) => !prevState)
    }
    const editReview = (cid, text, rating) => {
        axios
          .post(
            "https://moviesappserver-production.up.railway.app/user/review/update",
            {
              text: text,
              rating: rating,
              rwid: cid,
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
              var offset = new Date().getTimezoneOffset();
              let upd = new Date(o.updatedAt);
              var offsetTime = new Date(upd.getTime() - offset * 60 * 1000);
              o.updatedAt = offsetTime.toISOString();
              setReviewEdited(o);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status == 403) {
              logoutFunc();
            }
          });        
        setEditFormVisible(false);
    }
    const showAnswerForm = ()=>{
        if(!user?._id){
            alert("Log in before adding review")
        } else {
            setAnswerFormVisible((prevState) => !prevState)
        }
    }
    return(
        <>
        {!reviewRemoved && <div className='comment'>
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>removeComment(r?._id)}>delete</div>: ""}
            {r?.user == user?._id ? <div className='delete-comment' onClick={()=>showEdditCommentForm(r.text, r.rating)}>edit</div>: ""}
            <div className='delete-comment' onClick={showAnswerForm}>answer</div>
            {answerForm && <ReviewForm reviewId = {r?._id} />}            
            {editForm && <ReviewForm textInputClass="form-control" ratingInputClass="form-control" submitButtonClass="submit-edited-review" 
        cancelOptionClass="clickable-text" reviewID={r._id} textInitial={r.text} ratingInitial={r.rating} sendForm={editReview} 
        hideForm={()=>{setEditFormVisible(false)}} /> }
            <div className='comment-username'><a href={r?.user == user?._id ? `https://movies-app-playlists.netlify.app/user/playlists` : `https://movies-app-playlists.netlify.app/user/${r?.user}/playlists/public?uid=${r?.user}&uname=${r?.username}`}>
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
