import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Match from "./pages/Match";


import { getAnonymousId } from "./utils/getAnonymousId";

function App() {
  useEffect(() => {
    getAnonymousId();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/match" element={<Match />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
