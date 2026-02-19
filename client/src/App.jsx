import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PollList from "./pages/PollList";
import PollDetails from "./pages/PollDetails";
import CreatePoll from "./pages/CreatePoll";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<PollList />} />
        <Route path="/poll/:id" element={<PollDetails />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/results/:id" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
