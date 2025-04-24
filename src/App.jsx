import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Sign from "./components/Sign";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Sign" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default App;
