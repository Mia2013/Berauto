import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { pagesForPublic, pagesForAuthenticatedOnly, pagesForStaff } from "./pages/pages";
import Navigation from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";

function App() {
    return (
        <div className="App">
            <CssBaseline />
            <Navigation />
            <Suspense fallback={<Loading />}>
                <Routes>
                    {pagesForPublic.map((page) => (
                        <Route key={page.path} path={page.path} element={page.component} />
                    ))}

                    {pagesForAuthenticatedOnly.map((page) => (
                        <Route
                            key={page.path}
                            path={page.path}
                            element={<ProtectedRoute>{page.component}</ProtectedRoute>}
                        />
                    ))}

                    {pagesForStaff.map((page) => (
                        <Route
                            key={page.path}
                            path={page.path}
                            element={
                                <ProtectedRoute allowedRoles={page.allowedRoles}>
                                    {page.component}
                                </ProtectedRoute>
                            }
                        />
                    ))}

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
