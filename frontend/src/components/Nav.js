import React, { useState } from "react";
import { AppBar, Container, Box, Button, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { pagesForPublic, pagesForAuthenticatedOnly, pagesForStaff } from "../pages/pages";
import { useAuth } from "../provider/AuthProvider";
import TitleComponent from "./TitleComponent";

const Navigation = () => {
    const location = useLocation();
    const { isAuthenticated, isStaff, user, logOut } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const publicPages = pagesForPublic.filter((p) => !(p.hideWhenAuthed && isAuthenticated));
    const userPages = isAuthenticated ? pagesForAuthenticatedOnly : [];
    const staffPages = isStaff
        ? pagesForStaff.filter((p) => !p.allowedRoles || p.allowedRoles.length === 0 || p.allowedRoles.includes(user?.role))
        : [];

    const isStaffActive = staffPages.some((p) => location.pathname === p.path);

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

                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        {publicPages.map((page) => (
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

                        {userPages.map((page) => (
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

                        {staffPages.length > 0 && (
                            <>
                                <Button
                                    color="primary"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleOpenMenu}
                                    sx={{
                                        my: 1,
                                        fontWeight: isStaffActive ? 800 : 600,
                                    }}
                                >
                                    Adminisztráció
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                    disableScrollLock
                                    slotProps={{
                                        paper: {
                                            elevation: 3,
                                            sx: { mt: 1, minWidth: 180, borderRadius: 2 }
                                        }
                                    }}
                                >
                                    {staffPages.map((page) => (
                                        <MenuItem
                                            key={page.path}
                                            component={Link}
                                            to={page.path}
                                            onClick={handleCloseMenu}
                                            selected={location.pathname === page.path}
                                            sx={{
                                                fontWeight: location.pathname === page.path ? 800 : 500,
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            {page.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
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