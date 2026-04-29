import { useMemo } from "react";
import { AppBar, Container, Box, Button, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import TitleComponent from "./TitleComponent";
import LogoutBtn from "./LogoutBtn";
import { allPages } from "../pages/pages";
import { ROLES } from "../constants/constants";

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const homePage = allPages.filter(q => q.path === "/")[0];

  const navPages = useMemo(() => {
    const currentRole = user?.role || ROLES.GUEST;
    return allPages.filter(page =>
      page.showInNavbar && page.roles.includes(currentRole.toLowerCase())
    );
  }, [user]);

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: "rgba(245, 245, 245, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component={Link} to={homePage?.path || "/"} sx={{ textDecoration: "none" }}
            >
              <TitleComponent title="Bérautó" marginY={0} />
            </Box>
            <LogoutBtn />

          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {navPages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{
                  my: 1,
                  color: "text.secondary",
                  display: "block",
                  fontWeight: location.pathname === page.path ? 800 : 500,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;