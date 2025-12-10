import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Associate from './components/Associate';
import Admin from './components/Admin';
import Redirect from './components/Redirect';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/associate" element={<Associate />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/go/:slug" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
