const logoutFunc = () => {
    localStorage.removeItem('user')
    window.location.replace("http://localhost:3000")
    alert('Your session has expired. Log in again. New password will be sent to your email')
}
export default logoutFunc;