import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import UpdateUserInfo from './pages/updateUserInfo/UpdateUserInfo';

function App() {

  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? < Home /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/:username" element={< Profile />} />
        <Route path="/update_user_info/:username" element={< UpdateUserInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
