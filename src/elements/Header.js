import { useEffect, useState } from "react"

const Header = (props) =>{
  const submitHandler = (event) =>{
    // console.log(event)
    // event.preventDefault()
    props.onSearchName(event)
  }
  const [user, setUser] = useState("")
  const [link, setLink] = useState(<a href="https://movies-app-playlists.netlify.app/user/login"><div className="login">Log in</div></a>)
  const exit = (e)=>{
    e.preventDefault()
    localStorage.removeItem('user')
    setUser("")
    window.location.replace('https://movies-app-playlists.netlify.app/')
  }
  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('user')))
    console.log(localStorage.getItem('user'))
  }, [])
  //clicked-userlinks
  const [isClicked, setIsClicked] = useState(false)
  const clickDropdown = ()=>{
    setIsClicked(!isClicked)
  }
  useEffect(()=>{
    console.log("clicked "+isClicked)
  }, [isClicked])
  useEffect(()=>{
    if(user){
      setLink(
      <div className="login userlinks" onClick={clickDropdown}>&#x263A;
        {isClicked && 
          <div className="dropdown-clicked">
            <div className="hiddenusermenue-clicked">{user?.name}<div className="hr"></div></div>      
            <div className="hiddenusermenue-clicked"><a href={`https://movies-app-playlists.netlify.app/user/${user._id}/playlists`}>My watchlists</a></div>
            <div className="hiddenusermenue-clicked"><a href={`https://movies-app-playlists.netlify.app/user/${user._id}/passwordreset`}>Change password</a></div>
            <div className="hiddenusermenue-clicked"><a href="" onClick={exit}>Exit</a></div>
          </div>
        }
        {!isClicked &&
          <div className="dropdown">
            <div className="hiddenusermenue">{user?.name}<div className="hr"></div></div>      
            <div className="hiddenusermenue"><a href={`https://movies-app-playlists.netlify.app/user/${user._id}/playlists`}>My watchlists</a></div>
            <div className="hiddenusermenue"><a href={`https://movies-app-playlists.netlify.app/user/${user._id}/passwordreset`}>Change password</a></div>
            <div className="hiddenusermenue"><a href="" onClick={exit}>Exit</a></div>
          </div>
        }
      </div>)
    } else {
      setLink(<a href="https://movies-app-playlists.netlify.app/user/login"><div className="login">Log in</div></a>)
    }
    
  }, [user, isClicked])
  return (
    <div className="page-header">
      <a href='https://movies-app-playlists.netlify.app/'><div className="logo"><h1>Movies App</h1></div></a>
      <div className="searchbar">
        <form action="https://movies-app-playlists.netlify.app/" onSubmit={submitHandler}>
          <input type="text" placeholder="Search.." name="name" />
          <button type="submit">Submit</button>
        </form>
      </div>
      {link}
    </div>
  )
}
export default Header;