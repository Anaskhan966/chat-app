import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Layout from "./components/layout";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} /> */}
      <Route element={<Layout />}>
        <Route path="/chat" element={<Chat />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
