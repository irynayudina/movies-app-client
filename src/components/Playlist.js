import axios from 'axios';
import { useEffect, useState } from 'react';
import logoutFunc from '../utility/logoutFunc';
const Playlist = (props) =>{
  const [plItems, setPlItems] = useState([])
  const [propsItems, setPropsItems] = useState(props.it.items)
  const makeWatched = (i) => {
    axios
      .post(
        "https://movies-site-server.onrender.com/user/playlist/watched/film",
        {
          wid: i,
          pid: props.it._id,
        },
        {
          headers: {
            authorization: "Bearer " + props.user.accessToken,
          },
        }
      )
      .then((res) => {
        let o = res;
        if (o.data !== "err") {
          setPropsItems(o.data.items);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 403) {
          logoutFunc();
        }
      });
  }
  const removeFromPlaylist = (i) => {
    axios
      .post(
        "https://movies-site-server.onrender.com/user/playlist/delf",
        {
          pid: props.it._id,
          did: i,
        },
        {
          headers: {
            authorization: "Bearer " + props.user.accessToken,
          },
        }
      )
      .then((res) => {
        let o = res;
        if (o.data !== "err") {
          setPropsItems(o.data.items);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 403) {
          logoutFunc();
        }
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
  }, [propsItems])
    return  (
      <>
      {plItems}
      </>
    )
  }
  export default Playlist;
