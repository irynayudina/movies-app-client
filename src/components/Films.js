import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../elements/Header'
import Footer from '../elements/Footer'
import Select from '../elements/Select';

const Films = () => {
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  };
  const [screenSize, setScreenSize] = useState(window.innerWidth) 
  useEffect(()=>{
    let s = window.innerWidth
      if(s<576){
        setScreenSize("xs")
      } if(s >= 576){
        setScreenSize("sm")
      } if(s >= 683){
        setScreenSize("md")
      } if(s >= 880){
        setScreenSize("lg")
      } if(s >= 1230){
        setScreenSize("xl")
      } if(s >= 1400){
        setScreenSize("xxl")
      }
    function handleResize() {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
      let s = window.innerWidth
      if(s<580){
        setScreenSize("xs")
      } if(s >= 580){
        setScreenSize("sm")
      } if(s >= 683){
        setScreenSize("md")
      } if(s >= 880){
        setScreenSize("lg")
      } if(s >= 1230){
        setScreenSize("xl")
      } if(s >= 1400){
        setScreenSize("xxl")
      }
      console.log(screenSize)
    }
    window.addEventListener('resize', handleResize);
    return () => {window.removeEventListener('resize', handleResize)}    
  },[screenSize])

  const url = new URL(window.location.href);
  const q = url.search;
  const [isLoading, setIsLoading] = useState(false);
  const [films, setFilms] = useState([]);
  const [newFilms, setNewFilms] = useState([]);
  useEffect(() => {
    fetchFilms();
  }, []);
  useEffect(() => {
      setNewFilms(films.map(f => {
        let t = f;
        t.image = 'data:image/jpeg;base64,' + arrayBufferToBase64(f?.image?.img?.data)
        return (t.image)
      }))
  }, [films]);
const fetchFilms = () => {
  console.log(url.search)
  setIsLoading(true)
    if(q == ""){
      axios
      .get('https://movies-catalog-app.herokuapp.com/films/all', config)
      .then((res) => {
        let o = res.data
        o.map(f =>{
          let t = f
          t.release = new Date(t.release).getFullYear();
          return t
        })
        setFilms(o);
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
      });
    } else if(url.searchParams.get('actors') != "" || url.searchParams.get('director') != "" || 
    url.searchParams.get('typefm') != "" || url.searchParams.get('sortWay') != "" || url.searchParams.get('genres') != "" || 
    url.searchParams.get('name') != ""){
      console.log('querying')
      axios
      .get('https://movies-catalog-app.herokuapp.com/films/filter'+q)
      .then((res) => {
        let o = res.data
        o.map(f =>{
          let t = f
          t.release = new Date(t.release).getFullYear();
          return t
        })
        if(url.searchParams.get('sortWay') == 'yearSort'){
          function compare( a, b ) {
            if ( a.release< b.release ){
              return 1;
            }
            if ( a.release > b.release){
              return -1;
            }
            return 0;
          }
          o.sort(compare)
        }
        setFilms(o);
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
      });
    } else {
      axios
      .get('https://movies-catalog-app.herokuapp.com/films/name'+q)
      .then((res) => {
        let o = res.data
        o.map(f =>{
          let t = f
          t.release = new Date(t.release).getFullYear();
          return t
        })
        setFilms(o);
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
      });
    }    
};
const arrayBufferToBase64 = (buffer) => {
  return buffer?.toString('base64');
};
  const searchbarHandler = searchname => {
    console.log('In Films.js');
    console.log(searchname);
  };  
  const [isClickedFilterToggle, setIsClickedFilterToggle] = useState(false)

  return  (
  <>
  <Header onSearchName={searchbarHandler}/>
  <div className={`page-body-films page-body-films-${screenSize}`}>
    <div className={`toggle-filter-films-${screenSize}`} 
    onMouseEnter={() => setIsClickedFilterToggle(true)} onMouseLeave={() => setIsClickedFilterToggle(false)}>Filter</div>
    {(setIsClickedFilterToggle || window.innerWidth >= 880) ? 
    <div className={`filer-films`}> 
    <form action="">
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" placeholder="Film name.." />
      <label htmlFor="actors">Actors</label>
      <input type="text" id="actors" name="actors" placeholder="Actors separated by ," />
      <label htmlFor="directors">Directors</label>
      <input type="text" id="directors" name="directors" placeholder="Directors separated by ," />
      <label htmlFor="typefm">Type</label>
      <select id="typefm" name="typefm">
        <option value="">Any</option>
        <option value='series'>Series</option>
        <option value='movie'>Movie</option>
      </select>
      <Select />
      <label htmlFor="sortWay">Sort results by</label>
      <select id="sortWay" name="sortWay">
        <option value="yearSort">Year</option>
        <option value="imdbSort">IMDB</option>
      </select>
      <input type="submit" value="Show" />
    </form>
  </div>
  : ""}    
    <div className={`display display-${screenSize}`}>
    {isLoading && <h2 className='loading'>Loading...</h2>}
    {!isLoading && films.length === 0 && <h2 className='loading'>Found no movies.</h2>}
      {films.map((film) => (
        <div className={`card card-${screenSize}`} key={film._id}>
        <a href={"https://movies-app-playlists.netlify.app/films/id?id="+film._id}>
        <img src={film.image} alt='' />
        <h3>{film.name}</h3></a>
        <p><b>Release: </b>{film.release}</p>
        <p><b>IMDB: </b>{film.imdb}</p>
        {/* <button className='addtowl'><a href={"http://localhost:3000/films/id?id="+film._id}>Add to watchlist</a></button> */}
        </div>
      ))}
    </div>
  </div>
  <Footer />
  </>
  )
};
export default Films;