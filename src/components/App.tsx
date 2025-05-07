import { FC, useEffect, useState } from "react";
import { getItems, addItem, deleteItem } from "../services/apiService";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TitiPage from './chiledComponents/TitiPage';
import About from './chiledComponents/About';
import "./App.scss";

const App: FC = () => {


  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |  <Link to="/TitiPage">Titi Page</Link> | <Link to="/about">About</Link>
      </nav>

      <Routes>
      <Route path="/TitiPage" element={<TitiPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
