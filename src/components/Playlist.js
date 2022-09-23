import axios from 'axios';
import { useEffect, useState } from 'react';
const Playlist = (props) =>{
  const [plItems, setPlItems] = useState([])
  const [propsItems, setPropsItems] = useState(props.it.items)
  const makeWatched = (i) => {
    console.log(props.it._id)
    console.log('watched'+i)
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/watched/film', {
      "wid":  i,
      "pid": props.it._id
    })
    .then((res) => {
    let o = res
    console.log(o)
    if(o.data !== "err"){
      setPropsItems(o.data.items)
    }
    })
    .catch((err) => {
    console.log(err)
    });
  }
  const removeFromPlaylist = (i) => {
    console.log(props.it)
    console.log('removed'+i)
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/delf', {
      "pid":  props.it._id,
      "did": i
    })
    .then((res) => {
    let o = res
    console.log(o)
    if(o.data !== "err"){
      setPropsItems(o.data.items)
    }
    })
    .catch((err) => {
    console.log(err)
    });
  }
  useEffect(()=>{
    let pitems = []
    if(props.priv){
      propsItems.map( pl=>{
        if(pl.fname){
          pitems.push(<p className='err' key={pl._id}>
            <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.fname}</a>
          </p>)
        }
        else{
          pitems.push(<p className='err' key={pl._id}>
            <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.filmID}</a>
          </p>)
        }    
      })
    } else {
    propsItems.map( pl=>{
      if(pl.watched == true){
        if(pl.fname){
          pitems.push(<p className='err' key={pl._id}><span className='watch-film' onClick={()=>makeWatched(pl.filmID)}>&#128065;</span>
            <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.fname}</a><span className='close-film' 
            onClick={()=>removeFromPlaylist(pl.filmID)}>&#10006;</span>
          </p>)
        }
        else{
          pitems.push(<p className='err' key={pl._id}><span className='watch-film' onClick={()=>makeWatched(pl.filmID)}>&#128065;</span>
            <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.filmID}</a><span className='close-film' 
            onClick={()=>removeFromPlaylist(pl.filmID)}>&#10006;</span>
          </p>)
        }        
     } else {
      if(pl.fname){
        pitems.push(<p key={pl._id}><span className='watch-film' onClick={()=>makeWatched(pl.filmID)}>&#128065;</span>
        <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.fname}</a><span className='close-film' 
        onClick={()=>removeFromPlaylist(pl.filmID)}>&#10006;</span>
      </p>)
      }
      else{
        pitems.push(<p key={pl._id}><span className='watch-film' onClick={()=>makeWatched(pl.filmID)}>&#128065;</span>
        <a href={"https://movies-app-playlists.netlify.app/films/id?id="+pl.filmID}>{pl.filmID}</a><span className='close-film' 
        onClick={()=>removeFromPlaylist(pl.filmID)}>&#10006;</span>
      </p>)
      } 
     }
      })
    }
    setPlItems(pitems)
    console.log("list: "+JSON.stringify(props.it.items))
  }, [propsItems])
    return  (
      <>
      {plItems}
      </>
    )
  }
  export default Playlist;