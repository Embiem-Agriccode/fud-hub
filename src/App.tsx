import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import PostDetail from "./PostDetail";

// If npm install react-router-dom hasn't been run yet in this project, do
// that first — everything else here assumes it's available.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
