import { useEffect, useState } from "react"
const AddToPlaylist = (props) =>{
    const [cls, setCls] = useState(false)
    const hide = (e) =>{
        e.preventDefault()
        props.onPress(false)
        setCls(true)
    }
    useEffect(()=>{
        setCls(props.isHidden)
    }, [props.isHidden])
    return (
        <>
        <div className={`modal-bg ${cls ? 'hidden' : ''}`} onClick={hide}>
            <div className={`modal ${cls ? 'hidden' : ''}`} >jhbjojhoh</div>
        </div>
        </>
    )
}
export default AddToPlaylist;