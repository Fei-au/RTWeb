import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import { errorHandler } from '../requests/errorHandler';
import LoginPage from './auth/Login'
import StoredUserContext from '../context/StoredUserContext';
import Inventory from './home/Inventory';
import Dashboard from './home/Dashboard';
import Sell from './home/Sell';

let u = null;
try{
  u = JSON.parse(localStorage.getItem('user'));
}catch(err){
  errorHandler(err);
}

function App() {

  const [user, setUser] = useState(u);

  return (
      <Router>
        <StoredUserContext.Provider value={user}>
          <Routes>
            <Route exact path="/" element={<LoginPage setGlobalUser={setUser}/>} />
            <Route path="/login" element={<LoginPage setGlobalUser={setUser}/>}/>
            <Route path="/home" element={<Inventory setGlobalUser={setUser}/>}/>
            <Route path="/inventory" element={<Inventory setGlobalUser={setUser}/>}/>
            <Route path="/dashboard" element={<Dashboard setGlobalUser={setUser}/>}/>
            <Route path="/sell" element={<Sell setGlobalUser={setUser}/>}/>
          </Routes>
        </StoredUserContext.Provider>
      </Router>
  );
}

export default (App);