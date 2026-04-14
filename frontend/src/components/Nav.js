import { AppBar, Container, Box, Button, Toolbar, } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { pagesForAuthenticatedOnly, pagesForPublic } from "./../pages/pages";
import TitleComponent from "./TitleComponent";

const Navigation = () => {
  const location = useLocation();  
  const pages = [...pagesForPublic.filter(q => q.showInNavbar), 
    ...pagesForAuthenticatedOnly.filter(q => q.showInNavbar)];

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
          <TitleComponent title="Bérautó" marginY={0} />

          <Box sx={{ display: "flex", gap: 1 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}  
                to={page.path}
                sx={{
                  my:1,
                  color:  "text.secondary",
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