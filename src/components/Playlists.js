import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import Playlist from '../components/Playlist';
import logoutFunc from '../utility/logoutFunc';
import { useEffect, useState } from 'react';
const Playlists = () =>{
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))  
  const [rem, setRem] = useState({})
  const [publ, setPubl] = useState({})

  useEffect(()=>{
      setUser(JSON.parse(localStorage.getItem('user')))
  }, [])
  useEffect(()=>{
    setIsLoading(true)
    if(user){
      axios.get('https://movies-catalog-app.herokuapp.com/user/playlist', {
          headers: {
            authorization: "Bearer " + user.accessToken
          },
          params: {
              "uid": user._id
          }
      })
        .then((res) => {
          let o = res.data
          setPlaylists(o);
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false)
          if (err.response.status == 403) {
            logoutFunc()
        }
        });
    }    
  }, [user, rem, publ])
  const removePlaylist = (i) => {
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/del', {
      "pid":  i
    }, {            
      headers: {
        authorization: "Bearer " + user.accessToken
      } 
    })
    .then((res) => {
    let o = res
    setRem(o)
    })
    .catch((err) => {
      console.log(err)
      if (err.response.status == 403) {
        logoutFunc()
    }
    });
  }
  const makePublic = (i) => {
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/public', {
      "pid":  i
    }, {            
      headers: {
        authorization: "Bearer " + user.accessToken
      } 
    })
    .then((res) => {
    let o = res
    setPubl(o)
    })
    .catch((err) => {
      console.log(err)
      if (err.response.status == 403) {
        logoutFunc()
    }
    });
  }
    return  (
      <>
      <Header /><h2 style={{"paddingLeft":"10px"}}>User info:</h2>
      <div style={{"paddingLeft":"10px"}}>
      <p className='err'>{user?.name}</p>
      <p className='err'>{user?.email}</p>
      <p><small>Created: </small></p><p className='err'>{user?.createdAt?.slice(0,10)}</p>
      </div>  
      <h2 style={{"paddingLeft":"10px"}}>Watchlists:</h2>
      <div className="page-body-films">
        <div className="display-pl">
        {isLoading && <h2 className='loading'>Loading...</h2>}
        {!isLoading && playlists.length === 0 && <h2 className='loading'>Found no playlists.</h2>}
        {!isLoading && playlists.length !== 0 && <>
          {playlists.map((pl) => (
            <div className='card-playlist' key={pl._id}>
              <div className='playlist-control'>
              {!pl.isPublic && <div className='make-public' onClick={()=>makePublic(pl._id)}>make public</div>}
              {pl.isPublic && <div className='make-public-private' onClick={()=>makePublic(pl._id)}>make private</div>}                
                <div className='delete-playlist' onClick={()=>removePlaylist(pl._id)}>delete</div>
              </div>
              <h2>{pl?.name}</h2>
              <div className='hr'></div>
              
              <Playlist it={pl} user={ user} />
            </div>
          ))}</>}
        </div>
      </div>
      <Footer />
      </>
    )
  }
  export default Playlists;
