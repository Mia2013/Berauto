import React from "react";
import { AppBar, Container, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { pagesForPublic, pagesForAuthenticatedOnly, pagesForStaff } from "../pages/pages";
import { useAuth } from "../provider/AuthProvider";
import TitleComponent from "./TitleComponent";

const Navigation = () => {
    const location = useLocation();
    const { isAuthenticated, isStaff, user, logOut } = useAuth();

    const visiblePages = [
        ...pagesForPublic.filter((p) => !(p.hideWhenAuthed && isAuthenticated)),
        ...(isAuthenticated ? pagesForAuthenticatedOnly : []),
        ...(isStaff ? pagesForStaff : []),
    ];

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                backgroundColor: "rgba(245, 245, 245, 0.85)",
                backdropFilter: "blur(10px)",
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box component={Link} to="/" sx={{ textDecoration: "none" }}>
                        <TitleComponent title="Bérautó" />
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {visiblePages.map((page) => (
                            <Button
                                key={page.path}
                                component={Link}
                                to={page.path}
                                sx={{
                                    my: 1,
                                    color: "text.secondary",
                                    fontWeight: location.pathname === page.path ? 800 : 500,
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {isAuthenticated && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", md: "block" } }}>
                                {user?.name}
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<LogoutIcon />}
                                onClick={logOut}
                                sx={{ color: "text.secondary" }}
                            >
                                Kijelentkezés
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navigation;
