import Header from '../elements/Header'
import Footer from '../elements/Footer'
import Reviews from '../components/Reviews'
import AddToPlaylist from '../elements/AddToPlaylist';
import newContext from '../contexts/newContext';
import "../Film.css";
import { useEffect, useState } from 'react'
import axios from 'axios';
import logoutFunc from '../utility/logoutFunc';
const Film = (props) =>{
  const [screenSize, setScreenSize] = useState(window.innerWidth) 
  const [isLoading, setIsLoading] = useState(false);
  const [film, setFilm] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    const fid = url.searchParams.get('id'); // => 'hello'
    setIsLoading(true)
    axios
      .get(
        "https://moviesappserver-production.up.railway.app/films/id?id=" + fid
      )
      .then((res) => {
        const o = res.data;
        o.image =
          "data:image/jpeg;base64," + arrayBufferToBase64(o?.image?.img?.data); 
        o.release = new Date(o.release).getFullYear();
        if (o.genres) {
          o.genres = o.genres.map((g) => {
            let gr;
            gr = g + ", ";
            return gr;
          });
          o.genres[o.genres.length - 1] = o.genres[o.genres.length - 1].slice(
            0,
            -2
          );
        }
        if (o.director) {
          o.director = o.director.map((g) => {
            let gr;
            gr = g + ", ";
            return gr;
          });
          o.director[o.director.length - 1] = o.director[
            o.director.length - 1
          ].slice(0, -2);
        }
        if (o.actors) {
          o.actors = o.actors.map((g) => {
            let gr;
            gr = g + ", ";
            return gr;
          });
          o.actors[o.actors.length - 1] = o.actors[o.actors.length - 1].slice(
            0,
            -2
          );
        }
        setFilm(o);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
const arrayBufferToBase64 = (buffer) => {
  return buffer?.toString('base64');
};useEffect(()=>{
  let s = window.innerWidth
  function handleResize() {
    console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
    let s = window.innerWidth    
  }
  window.addEventListener('resize', handleResize);
  return () => {window.removeEventListener('resize', handleResize)}  
},[])
useEffect(()=>{
  let s = window.innerWidth
    if(s<576){
      setScreenSize("xs")
    } else if(s >= 576){
      setScreenSize("sm")
    } if(s >= 683){
      setScreenSize("md")
    } else if(s >= 992){
      setScreenSize("lg")
    } else if(s >= 1230){
      setScreenSize("xl")
    } else if(s >= 1400){
      setScreenSize("xxl")
    }
  function handleResize() {
    console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
    let s = window.innerWidth
    if(s<576){
      setScreenSize("xs")
    } if(s >= 576){
      setScreenSize("sm")
    } if(s >= 683){
      setScreenSize("md")
    } if(s >= 992){
      setScreenSize("lg")
    } if(s >= 1230){
      setScreenSize("xl")
    } if(s >= 1400){
      setScreenSize("xxl")
    }
  }
  window.addEventListener('resize', handleResize);
  return () => {window.removeEventListener('resize', handleResize)}
  
},[])
const searchbarHandler = searchname => {
  console.log('In Film.js');
  console.log(searchname);
};
const [playlistHidden, setPlaylistHidden] = useState(true)
const [playlists, setPlaylist] = useState([])
const [user, setUser] = useState("")
useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('user')))
    console.log(localStorage.getItem('user'))    
}, [])
useEffect(()=>{
  // setIsLoading(true)
  if(user){
    axios
      .get("https://moviesappserver-production.up.railway.app/user/playlist", {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
        params: {
          uid: user._id,
        },
      })
      .then((res) => {
        let o = res.data;
        setPlaylist(o);
        // setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 403) {
          logoutFunc();
        }
      });
  }    
}, [user])
const showModalPlaylistAdd = (e)=>{
  e.preventDefault()
  if(!user){
    alert("Log in before saving movie to watchlist")
  } else {
    setPlaylistHidden(false)
  }
}
const [isChildClicked, setIsChildClicked] = useState(false)
const hideModalPlaylistAdd = () => {
  if(!isChildClicked){
  setPlaylistHidden(true)  
  }
};  

const [nameValid, setNameValid] = useState(false)
const [name2Valid, setName2Valid] = useState(false)


const [nameInp, setNameInp] = useState("")
const [name2Inp, setName2Inp] = useState("")

    const [nameInpTouched, setNameInpTouched] = useState(false)
    const [name2InpTouched, setName2InpTouched] = useState(false)

    const nameHandler = (e)=>{
    setNameInp(e.target.value)
    }
    const name2Handler = (e)=>{
      setName2Inp(e.target.value)
      }

    const nameBlurHandler = (e) => {
    setNameInpTouched(true);
    setNameValid((nameInp !== "") || !nameInpTouched);
    }
    const name2BlurHandler = (e) => {
      setName2InpTouched(true);
      setName2Valid((name2Inp !== "") || !name2InpTouched);
      }
    const addNewPlaylist = (e) => {      
      const url = new URL(window.location.href);
      const urlfid = url.searchParams.get('id')
      e.preventDefault();
      if(nameValid){
        axios
          .post(
            "https://moviesappserver-production.up.railway.app/user/playlist/new/film",
            {
              name: nameInp,
              uid: user._id,
              fid: urlfid,
              fname: film.name,
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
              alert("film was sucessfully added to watchlist");
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }     
  }
  const [plid2, setPlid2] = useState("");

  const addToPlaylist =(e) =>{
    const url = new URL(window.location.href);
      const urlfid = url.searchParams.get('id')
      console.log("pl name")
      console.log(name2Inp)
      e.preventDefault();
      if(name2Valid){
        axios
          .post(
            "https://moviesappserver-production.up.railway.app/user/playlist",
            {
              plid: name2Inp,
              fid: urlfid,
              fname: film.name,
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
              alert("film was sucessfully added to watchlist");
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }
  const stringForContext = "new value";
  return  (
  <newContext.Provider value={stringForContext}>
  <div className={`modal-bg ${playlistHidden ? 'hidden' : ''}`} >
    <div className={`modal ${playlistHidden ? 'hidden' : ''}`} >
      <div className='close' onClick={hideModalPlaylistAdd}>&#10006;</div>
      <h3 className='err2'>Choose a watchlist or create a new one to add a film to.</h3>
      <form onSubmit={addNewPlaylist}>
        <label htmlFor="name">Create new:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input type="text" name="name" className="form-control" id="name" 
        onChange={nameHandler}
        onBlur={nameBlurHandler}
        value={nameInp} />
        {nameInpTouched && !nameValid && <div className='err'><small>Text can`t be empty</small></div>}
        <button type="submit" >Submit</button>
      </form>
      <form onSubmit={addToPlaylist}>
        <label htmlFor="name">Choose: </label>
        <select id="typefm2" name="name2" onChange={name2Handler}
        onBlur={name2BlurHandler}
        value={name2Inp} >
          <option value=""></option>
          {playlists.map((pl) => (
            <option value={pl._id}>{pl.name}</option>
          ))}
        </select>
        <button type="submit" >Submit</button>
      </form>
    </div>
  </div>
  <Header onSearchName={searchbarHandler}/>
  <div className="page-body">    
    <div className="display-film">
      <div className='film-image'><img src={film?.image} alt='' /><button className='addtowl' onClick={showModalPlaylistAdd}>
        Add to watchlist</button></div>
      <div className={`info-film description-${screenSize}`}>
      {isLoading && <h2 className='loading'>Loading...</h2>}
      {!isLoading && !film && <h2 className='loading'>Film not found</h2>}
        <h2>{film?.name}</h2>
        <p>{film?.description}</p>
        {film.release ? <p><b>Release: </b>{film.release}</p> : "" }
        {film.typefm && <p><b>Type: </b>{film.typefm[0].toUpperCase() + film.typefm.slice(1, film.typefm.length)}</p>}
        {film.genres ? <p><b>Genres: </b>{film.genres}</p> : "" }
        {film.imdb && <p><b>IMDB: </b>{film.imdb}</p>}
        {film.director ? <p><b>Director: </b>{film.director}</p> : ""}
        {film.actors ? <p><b>Actors: </b>{film.actors}</p> : ""}
      </div>
    </div>
  </div>
  <div className='reviews'><Reviews /></div>
  <Footer />
  </ newContext.Provider>
  )
}
export default Film;