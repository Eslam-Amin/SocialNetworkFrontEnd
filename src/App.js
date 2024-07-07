import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import UpdateUserInfo from './pages/updateUserInfo/UpdateUserInfo';
import ForgotPassword from './pages/Forget Password/ForgotPassword';
import ResetPassword from './pages/Reset Password/ResetPassword';
import VerifyAccount from './pages/Verify Account/VerifyAccount';
import Messenger from './pages/messenger/Messenger';


function App() {

  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? < Home /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messenger" element={user ? <Messenger /> : <Login />} />
        <Route path="/:username" element={user ? < Profile /> : <Login />} />
        <Route path="/update-user-info/:username" element={user ? < Profile /> : < UpdateUserInfo />} />
        <Route path="/authenticate/forgot-password" element={< ForgotPassword />} />
        <Route path="/authenticate/reset-password/:token" element={<ResetPassword />} />
        <Route path="/authenticate/verify-account/:token" element={<VerifyAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
