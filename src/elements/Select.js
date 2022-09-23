import { useEffect, useState } from "react"
const Select = () =>{    
  const [additionalGenre, setAdditionalGenre] = useState([])
  const [genresSelected, setGenresSelected] = useState([])
  const [initialGenre, setInitialGenre] = useState('')
  const [v, setV] = useState('')
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
        console.log(genresSelected)
        setV([...genresSelected].toString())
        console.log(v)
    }, [genresSelected, v])
    return (
        <>
        <label htmlFor="genres">Genres <button onClick={addGenre}>+</button></label>
        <select id="genres" name="genres" className="hiddenSelect" onChange={addSelectedGenre} value={v}>
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
        </>        
    )
}
export default Select;