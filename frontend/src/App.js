import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

import { allPages } from "./pages/pages";
import Navigation from "./components/Nav";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
function App() {

  return (
    <div className="App">
      <CssBaseline />
      <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} minHeight={"100vh"}>
        <Navigation />
        <Box sx={{ py: 3, flexGrow:1 }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              {allPages.map((page) => (
                <Route key={page.name} path={page.path} element={page.component} />
              ))}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </div>
  );
}

export default App;
