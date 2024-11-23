import React from "react";
import "./App.css";
import NavigationBar from "./components/navigationBar/navBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import AddSubspacePage2 from "./pages/subspaceC";
import Explore from "./pages/explore";
import FetchDataTestPage from  "./pages/test";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-subspace" element={<AddSubspacePage2 />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/FetchDataTestPage" element={<FetchDataTestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
