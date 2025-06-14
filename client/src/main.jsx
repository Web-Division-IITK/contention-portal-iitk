import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Signinup } from "./pages/Login";
import { Portal } from "./pages/Portal";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Signinup />} />
        <Route path="/portal" element={<Portal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
