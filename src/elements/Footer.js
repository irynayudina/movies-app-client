const Footer = () =>{
    let o = <a href="https://movies-app-playlists.netlify.app/developer">Developer Version</a>
    if(window.location.href == 'https://movies-app-playlists.netlify.app/developer'){
        o = <a href="https://movies-app-playlists.netlify.app/">User Version</a>
    }
    
    return (<footer><h2><small>Switch to </small>{o}</h2></footer>)
}
export default Footer;