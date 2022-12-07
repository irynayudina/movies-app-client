import { useContext, useEffect, useState } from 'react';
import reviewAnswerContext from '../contexts/reviewAnswerContext';
const ReviewForm = (props)=> {
    // props:
    // text input class textInputClass
    // submit button class submitButtonClass
    // rating input class ratingInputClass
    // cancel option class cancelOptionClass
    // id of relater review reviewID
    // send form function sendForm
    // hide form function hideForm
    // textInitial
    // ratingInitial
    const [textInp, setTextInp] = useState(props.textInitial)
    const [textValid, setTextValid] = useState(false)
    const [textInpTouched, setTextInpTouched] = useState(false)
    const [textError, setTextError] = useState("")
    const [ratingInp, setRatingInp] = useState(props.ratingInitial)
    const [ratingValid, setRatingValid] = useState(true)
    const [ratingInpTouched, setRatingInpTouched] = useState(false)
    const [ratingError, setRatingError] = useState("")
    const [formIsValid, setFormIsValid] = useState(false)
    const textHandler = (e)=>{
        setTextInpTouched(true);
        validateText(e.target.value)
        setTextInp(e.target.value)
    }
    const textBlurHandler = (e) => {
        setTextInpTouched(true);
        validateText(textInp)
        if(ratingInp == "" && textInp == ""){
            setRatingInpTouched(false)
            setTextInpTouched(false)
        }
    }
    const validateText = (txt) => {
        setTextValid(txt !== "" && txt.length <=10000)
        if(txt == ""){
            setTextError("Text can`t be empty!")
            setTextValid(false)
        }
        if(txt.length > 10000){
            setTextError("Text is too long - it shoud be 1000 characters maximum")
            setTextValid(false)
        }
    }
    const ratingHandler = (e) =>{
        setRatingInpTouched(true)
        validateRating(e.target.value)
        setRatingInp(e.target.value)
    }
    const ratingBlurHandler = (e) => {
        setRatingInpTouched(true)
        validateRating(ratingInp)
        if(ratingInp == "" && textInp == ""){
            setRatingInpTouched(false)
            setTextInpTouched(false)
        }
    }
    const validateRating = (rt) => {  
        setRatingValid(true)
        if(!(rt >= 1 && rt <= 10)){
            setRatingError("Rating should be between 1 and 10.")
            setRatingValid(false)
        }
    }
    useEffect(()=>{setFormIsValid(textValid && ratingValid)}, [textValid, ratingValid])
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(formIsValid){
            props.sendForm(props.reviewID, textInp, ratingInp)
            //do one of 3 functions: answwer add edit - props.function()
        }
    }
    const onCancelHandler = (e) => {
        e.preventDefault();
        props.hideForm()
    }
    return(
        <form onSubmit={onSubmitHandler}>
            <label htmlFor="text">Text</label>
            <textarea name="textEdit" className={props.textInputClass} id="text" cols="30" rows="10" maxLength="10001" 
            onChange={textHandler}
            onBlur={textBlurHandler}
            value={textInp} />
            {textInpTouched && !textValid && <div className='err'><small>Error: {textError}</small></div>}            
            {props.ratingInputClass && <><label>Rating </label>
            <input type="number" max="10" step="0.1" min="1" className={props.ratingInputClass} 
            id="rating" name="rating" placeholder="8.9"
            onChange={ratingHandler} 
            onBlur={ratingBlurHandler}
            value={ratingInp} /></>
            }
            {ratingInpTouched && !ratingValid && <div className='err'><small>Error: {ratingError}</small></div>}
            <button type="submit" className={props.submitButtonClass}>Submit</button> 
            {props.cancelOptionClass && 
            <label className={`clickable-text ${props.cancelOptionClass}`} onClick={onCancelHandler}><small>Cancel</small></label>}
        </form>
    )
}
export default ReviewForm;