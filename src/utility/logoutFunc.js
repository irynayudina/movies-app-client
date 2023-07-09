const logoutFunc = () => {
    localStorage.removeItem('user')
    window.location.replace("https://movies-app-playlists.netlify.app/")
    alert('Your session has expired. Log in again. New password will be sent to your email')
}
export default logoutFunc;