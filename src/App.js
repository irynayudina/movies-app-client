import "./App.css";
import Container from 'react-bootstrap/Container';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<Films />} />
        <Route path="/films/:fid" element={<Film />} />
        <Route path="/user/:id/playlists" element={<Playlists />} />
        <Route path="/user/:id/playlists/public" element={<PlaylistsPublic />} />
        <Route path="/user/:id/playlist/:pid" element={<Playlist />} />
        <Route path="/user/:id/passwordreset" element={<PasswordReset />} />
        <Route path="/developer" element={<FilmAdd />} />
        <Route path="/user/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>      
    </BrowserRouter>
  );
}

export default App;