import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/product" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
