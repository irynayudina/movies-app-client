import Header from '../elements/Header'
import axios from 'axios';
import Footer from '../elements/Footer'
import Playlist from '../components/Playlist';
import { useEffect, useState } from 'react';
const Playlists = () =>{
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))  
  const [rem, setRem] = useState({})
  const [publ, setPubl] = useState({})

  useEffect(()=>{
      setUser(JSON.parse(localStorage.getItem('user')))
      console.log(localStorage.getItem('user'))
  }, [])
  useEffect(()=>{
    setIsLoading(true)
    if(user){
      console.log(user._id)
      axios
        .get('https://movies-catalog-app.herokuapp.com/user/playlist', {
          params: {
              "uid": user._id
          }
      })
        .then((res) => {
          let o = res.data
          console.log(o)
          setPlaylists(o);
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false)
        });
    }    
  }, [user, rem, publ])
  const removePlaylist = (i) => {
    console.log('removed'+i)
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/del', {
      "pid":  i
    })
    .then((res) => {
    let o = res
    setRem(o)
    console.log(o)
    })
    .catch((err) => {
    console.log(err)
    });
  }
  const makePublic = (i) => {
    console.log('published'+i)
    axios.post('https://movies-catalog-app.herokuapp.com/user/playlist/public', {
      "pid":  i
    })
    .then((res) => {
    let o = res
    setPubl(o)
    console.log(o)
    })
    .catch((err) => {
    console.log(err)
    });
  }
    return  (
      <>
      <Header />
      <h2 style={{"padding-left":"10px"}}>Watchlists:</h2>
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
              
              <Playlist it={pl}/>
            </div>
          ))}</>}
        </div>
      </div>
      <Footer />
      </>
    )
  }
  export default Playlists;