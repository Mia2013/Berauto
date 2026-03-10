import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import{pagesForAuthenticatedOnly,pagesForPublic } from "./pages/pages";
import Navigation from "./components/Nav";
import Loading from "./components/Loading";
function App() {

     const pages = [...pagesForAuthenticatedOnly, ...pagesForPublic];
  return (
    <div className="App">
      <CssBaseline />
      <Navigation />
      <Suspense fallback={<Loading />}>
        <Routes>
          {pages.map((page) => (
            <Route key={page.name} path={page.path} element={page.component} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
       </Suspense>
     </div>
  );
}

export default App;
