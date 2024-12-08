import React, { useState } from "react";
import "./App.css";
import NavigationBar from "./components/navigationBar/navBar";
import InfoPanel from "./components/infoPanel/infoPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import AddSubspacePage2 from "./pages/subspaceC";
import Explore from "./pages/explore";
import RadarComparison from "./components/RadarComparison"
import EditSubspace from "./pages/edit";

function App() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  const toggleInfoPanel = () => {
    setIsInfoPanelOpen(!isInfoPanelOpen);
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar onOpenInfoPanel={toggleInfoPanel} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-subspace" element={<AddSubspacePage2 />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/radar" element={<RadarComparison />} />
          <Route path="/edit-subspace" element={<EditSubspace />} />
        </Routes>
        <InfoPanel isOpen={isInfoPanelOpen} onClose={() => setIsInfoPanelOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
