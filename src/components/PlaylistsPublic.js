
import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import Playlist from '../components/Playlist';
import { useEffect, useState } from 'react';
const PlaylistsPublic = () =>{
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(false) //JSON.parse(localStorage.getItem('user')) 
  const [rem, setRem] = useState({})
  const [publ, setPubl] = useState({})

  useEffect(()=>{
      console.log(user)
      const url = new URL(window.location.href);
      const u = url.searchParams.get('uid')
      console.log(u)
      const un = url.searchParams.get('uname')
      console.log(un)
      setUser({_id:u, name:un})
  }, [])
  useEffect(()=>{
    setIsLoading(true)
    if(user){
      console.log(user._id)
      axios
        .get("https://movies-site-server.onrender.com/user/playlistPublic", {
          params: {
            uid: user._id,
          },
        })
        .then((res) => {
          let o = res.data.filter((p) => p.isPublic);
          console.log(o);
          console.log(user);
          setPlaylists(o);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }    
  }, [user, rem, publ])
    return  (
      <>
      <Header />
      <h2 style={{"padding-left":"10px"}}>Public watchlists of {user?.name}:</h2>
      <div className="page-body-films">
        <div className="display-pl">
        {isLoading && <h2 className='loading'>Loading...</h2>}
        {!isLoading && playlists.length === 0 && <h2 className='loading'>Found no playlists.</h2>}
        {!isLoading && playlists.length !== 0 && <>
          {playlists.map((pl) => (
            <div className='card' key={pl._id}>
              <h2>{pl?.name}</h2>
              <div className='hr'></div>
              <Playlist it={pl} key={pl} priv={true}/>
            </div>
          ))}</>}
        </div>
      </div>
      <Footer />
      </>
    )
  }
export default PlaylistsPublic;