import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { allPages } from "./pages/pages";
import Navigation from "./components/Nav";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
function App() {

  return (
    <div className="App">
      <CssBaseline />
      <Navigation />
      <Suspense fallback={<Loading />}>
        <Routes>
          {allPages.map((page) => (
            <Route key={page.name} path={page.path} element={page.component} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
