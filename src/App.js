import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Switch, Redirect } from 'react-router-dom';
import Films from './components/Films'
import Film from './components/Film'
import Playlists from './components/Playlists'
import Playlist from './components/Playlist'
import PasswordReset from './components/PasswordReset'
import FilmAdd from './components/FilmAdd'
import LogIn from './components/LogIn'
import Register from './components/Register'
import PlaylistsPublic from  './components/PlaylistsPublic'
import ReviewForm from './elements/ReviewForm';
import logoutFunc from "./utility/logoutFunc";
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
function App() {
  let location = window.location;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user.pwEmail) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        logoutFunc()
      }
    }
  }, [location]);
  return (
    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<Films />} />
        <Route path="/films/:fid" element={<Film />} />
        <Route path="/user/playlists" element={<Playlists />} />
        <Route path="/user/:id/playlists/public" element={<PlaylistsPublic />} />
        <Route path="/user/:id/playlist/:pid" element={<Playlist />} />
        <Route path="/user/passwordreset" element={<PasswordReset />} />
        <Route path="/developer" element={<FilmAdd />} />
        <Route path="/user/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/testAnswer" element={<ReviewForm textInputClass="form-control" submitButtonClass="submit-edited-review"  
        cancelOptionClass="clickable-text" sendForm={{}} hideForm={{}} />} />
        <Route path="/testAdd" element={<ReviewForm textInputClass="form-control" submitButtonClass="" ratingInputClass="form-control" 
        sendForm={{}} hideForm={{}} />} />
        <Route path="/testEdit" element={<ReviewForm textInputClass="form-control" submitButtonClass="submit-edited-review" 
        cancelOptionClass="clickable-text" sendForm={{}} hideForm={{}} />} />
      </Routes>      
    </BrowserRouter>
  );
}
export default App;
