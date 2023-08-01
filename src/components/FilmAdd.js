import Header from '../elements/Header'
import Footer from '../elements/Footer'
import { useEffect, useState } from 'react';
import axios from 'axios';

const FilmAdd = () =>{  
const FormData = require('form-data');
const fs = require("fs")
  const [selectedFile, setSelectedFile] = useState(null);
    const [fnameInp, setfnameInp] = useState("")
    const [factorsInp, setfactorsInp] = useState("")
    const [fdirectorInp, setfdirectorInp] = useState("")
    const [fimdbInp, setfimdbInp] = useState(8.7)
    const [fdescriptionInp, setfdescriptionInp] = useState("")
    const [freleaseInp, setfreleaseInp] = useState("")
    const [fgenresInp, setfgenresInp] = useState("")  
    const [ftypefmInp, setftypefmInp] = useState("")
    const [fimageInp, setfimageInp] = useState("")

    const fnameHandler = (e)=>{
        setfnameInp(e.target.value)
    }
    const factorsHandler = (e)=>{
        setfactorsInp(e.target.value)
    }
    const fdirectorHandler = (e)=>{
        setfdirectorInp(e.target.value)
    }
    const fimdbHandler = (e)=>{
        setfimdbInp(e.target.value)
    }
    const fdescriptionHandler = (e)=>{
        setfdescriptionInp(e.target.value)
    }
    const freleaseHandler = (e)=>{
        setfreleaseInp(e.target.value)
    }
    const fgenresHandler = (e)=>{
        setfgenresInp(e.target.value)
    }
    const ftypefmInpHandler = (e)=>{
        setftypefmInp(e.target.value)
    }
    const fimageHandler = (e)=>{
        setfimageInp(e.target.files[0])
    }
    const [success, setSuccess] = useState(false)
    
    const [v, setV] = useState('')
  const addNewFilm = (e)=>{
    e.preventDefault()
    setfnameTouched(true);
    setfnameValid((fnameInp.trim() !== "") || !fnameTouched);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if(fnameInp !== ""){
      axios
        .post(
          "https://movies-site-server.onrender.com/films/upload",
          // formData
          {
            "film-name": fnameInp,
            "film-actors": factorsInp,
            "film-director": fdirectorInp,
            "film-imdb": fimdbInp,
            "film-description": fdescriptionInp,
            "film-release": freleaseInp,
            "film-genres": v,
            typefm: ftypefmInp,
            filmImage: selectedFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          let o = res.data;
          if (!o.error) {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });  
    }
      
  }
  useEffect(()=>{
      if(success){
          alert("Film was successfully added to the database!")
      }
  }, [success])


    const [additionalGenre, setAdditionalGenre] = useState([])
    const [genresSelected, setGenresSelected] = useState([])
    const [initialGenre, setInitialGenre] = useState('')
      const addGenre = (e) =>{
          e.preventDefault()
          setAdditionalGenre((prev)=> {
            if(prev.length < 1){
              return [0]
            } else {
              return [ ...prev, prev[prev.length-1]+1]}
            })
      }
      const addSelectedGenre = (e) =>{
          setGenresSelected([...genresSelected, e.target.value])
          setInitialGenre(e.target.value)
      }
      useEffect(()=>{
          setV([...genresSelected].toString())
      }, [genresSelected, v, selectedFile])
      const [fnameTouched, setfnameTouched] = useState(false)
      const [fnameValid,  setfnameValid] = useState(false)
      const fnameBlurHandler = (e) => {
        setfnameTouched(true);
        setfnameValid((fnameInp.trim() !== "") || !fnameTouched);
    }
    return  (
        <>
        <Header />   
                <div className="add-films"> 
                <h1>Add new film</h1>
                <div className="hr"></div>
                <form onSubmit={addNewFilm}>
                
                <label htmlFor="film-name"><small className='err'>* </small>Film Name</label>
                <input type="text" onChange={fnameHandler} value={fnameInp} onBlur={fnameBlurHandler} id="film-name" name="film-name" placeholder="Film"/>
                {!fnameValid && fnameTouched && <small className='err'>Name cant` be empty<br></br></small>}

                <label htmlFor="film-actors">Film Actors</label>
                <input type="text" onChange={factorsHandler} value={factorsInp} id="film-actors" name="film-actors" aria-describedby="actorsHelp" placeholder="List of ids of actors separated by ,"/>
                
                <label htmlFor="film-director">Film Director</label>
                <input type="text" onChange={fdirectorHandler} value={fdirectorInp} id="film-director" name="film-director" aria-describedby="directorsHelp" placeholder="List of ids of directors separated by ,"/>
                
                <label htmlFor="film-imdb">IMDB rating</label>
                <input type="number" max="10" step="0.1" min="1" onChange={fimdbHandler} value={fimdbInp} id="film-imdb" name="film-imdb" aria-describedby="directorsHelp" placeholder="8.9"/>
                    
                <label htmlFor="film-description">Description</label>
                <textarea name="film-description" onChange={fdescriptionHandler} value={fdescriptionInp} id="film-description" cols="30" rows="10"></textarea>
                            
                <label htmlFor="film-release">Release Date</label>
                <input type="date" onChange={freleaseHandler} value={freleaseInp} name="film-release" id="film-release" data-date-format="mm/dd/yyyy"/>
   
                <label htmlFor='film-genres'>Genres <button onClick={addGenre}>+</button></label>
                <select id="film-genres" name="film-genres" className="hiddenSelect" onChange={addSelectedGenre} value={v}>
                <option value={v}>{initialGenre}</option>
                </select>
                <select onChange={addSelectedGenre}>
          <option value="">Any</option>
          <option value='fantasy'>Fantasy</option>
          <option value='Science fiction'>Science fiction</option>
          <option value='thriller'>Thriller</option>
          <option value='drama'>Drama</option>
          <option value="animated">Animated</option>
          <option value="anime">Anime</option>
          <option value="action">Action</option>
          <option value="detective">Detective</option>
          <option value="documentary">Documentary</option>
          <option value="historical">Historical</option>
          <option value="comedy">Comedy</option>
          <option value="crime">Criminal</option>
          <option value="melodrama">Melodrama</option>
          <option value="mystical">Mystical</option>
          <option value="adventure">Adventure</option>
          <option value="realityshow">Reality show</option>
          <option value="family">Family</option>
          <option value="horror">Horror</option>
          <option value="fantastic">Fantastic</option>
        </select>
        {additionalGenre.map(g => <select key={g} onChange={addSelectedGenre}>
          <option value="">Any</option>
          <option value='fantasy'>Fantasy</option>
          <option value='Science fiction'>Science fiction</option>
          <option value='thriller'>Thriller</option>
          <option value='drama'>Drama</option>
          <option value="animated">Animated</option>
          <option value="anime">Anime</option>
          <option value="action">Action</option>
          <option value="detective">Detective</option>
          <option value="documentary">Documentary</option>
          <option value="historical">Historical</option>
          <option value="comedy">Comedy</option>
          <option value="crime">Criminal</option>
          <option value="melodrama">Melodrama</option>
          <option value="mystical">Mystical</option>
          <option value="adventure">Adventure</option>
          <option value="realityshow">Reality show</option>
          <option value="family">Family</option>
          <option value="horror">Horror</option>
          <option value="fantastic">Fantastic</option>
        </select>)}

                <label htmlFor="typefm">Type</label>
                <select id="typefm" name="typefm" onChange={ftypefmInpHandler} value={ftypefmInp}>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                </select>

                <label htmlFor="film-image"><small className='err'>* </small>Film Image</label>
                <input type="file" 
          onChange={(e) => setSelectedFile(e.target.files[0])} /> 
          {/* onChange={fimageHandler} id="filmImage" name="filmImage" */}

                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>  
        <Footer />
        </>
    )
  }
  export default FilmAdd;